import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useUploadMidias } from "@/hooks/useUpload";
import Image from "next/image";
import { ImovelFront } from "@/types/imovel";
import CustomCheckbox from "@/components/busca/CustomCheckbox";
import Header from "@/components/Header";
import FiltroImoveis from "@/components/busca/Filtro";
import { Filtros } from "@/types/imovel";
import PropertyCard from "@/components/index/PropertyCard";

interface Tag {
  id: string;
  nome: string;
}

interface DashboardProps {
  imoveis: ImovelFront[];
  tags: Tag[];
}

export default function Dashboard({ imoveis: initialImoveis, tags }: DashboardProps) {
  const [imoveis, setImoveis] = useState(initialImoveis);
  const [imoveisFiltrados, setImoveisFiltrados] = useState(initialImoveis);
  const capaInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [capa, setCapa] = useState<string | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [editImovel, setEditImovel] = useState<ImovelFront | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [novoLancamento, setNovoLancamento] = useState(false);

  const { upload, loading: uploadingMidias, erro: erroUpload } = useUploadMidias();

  async function fetchImoveis() {
    const res = await fetch("/api/imoveis");
    if (!res.ok) return alert("Erro ao buscar imóveis");
    const data: ImovelFront[] = await res.json();

    setImoveis(data);
    setImoveisFiltrados(data); // 🔥 garante que a lista filtrada começa com todos
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...fileArray]);

    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  }

  function handleTagChange(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  }

  async function salvarImovel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editImovel && !capaFile) {
      alert("Selecione uma capa antes de salvar o imóvel.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const parsedData = {
      ...body,
      valor: Number(body.valor),
      quartos: Number(body.quartos || 0),
      banheiros: Number(body.banheiros || 0),
      vagas: Number(body.vagas || 0),
      metrosQuadrados: Number(body.metrosQuadrados || 0),
      tags: selectedTags,
      lancamento: editImovel ? editImovel.lancamento : novoLancamento,
    };

    const url = editImovel ? `/api/imoveis/${editImovel.id}` : "/api/imoveis";

    const method = editImovel ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedData),
    });

    if (!res.ok) {
      alert("Erro ao salvar imóvel");
      return;
    }

    const savedImovel = await res.json();

    // Upload de mídias
    if (!editImovel) {
      // Criando imóvel -> sobe tudo (capa + galeria)
      const arquivosParaUpload = capaFile
        ? [capaFile, ...selectedFiles.filter(f => f !== capaFile)]
        : selectedFiles;

      if (arquivosParaUpload.length > 0) {
        const midiasUpload = await upload(arquivosParaUpload);

        await Promise.all(
          midiasUpload.map((midia, idx) => {
            const tipo = (capaFile && idx === 0) ? "capa" : midia.tipo;
            return fetch("/api/midias", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imovelId: savedImovel.id,
                url: midia.url,
                tipo,
              }),
            });
          })
        );
      }
    } else {
      // Editando imóvel -> só atualiza capa se mudou
      if (capaFile) {
        const [capaUpload] = await upload([capaFile]);
        if (capaUpload.url !== capa) {
          await fetch("/api/midias", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imovelId: savedImovel.id,
              urlNova: capaUpload.url,
            }),
          });
        }
      }

      // Outras mídias (sem capa)
      if (selectedFiles.length > 0) {
        const midiasUpload = await upload(selectedFiles);
        await Promise.all(
          midiasUpload.map((midia) =>
            fetch("/api/midias", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imovelId: savedImovel.id,
                url: midia.url,
                tipo: midia.tipo,
              }),
            })
          )
        );
      }
    }

    await fetchImoveis(); // Sempre buscar imóveis atualizados

    // Reset modal
    setModalOpen(false);
    setEditImovel(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setSelectedTags([]);
    setCapa(null);
    setCapaFile(null);
  }

  async function excluirImovel(id: string) {
    if (!confirm("Deseja excluir este imóvel?")) return;

    const res = await fetch(`/api/imoveis/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Erro ao excluir imóvel");
      return;
    }

    await fetchImoveis();
  }

  async function excluirMidia(url: string) {
    if (!editImovel) return;
    if (!confirm("Deseja excluir esta mídia?")) return;

    const res = await fetch("/api/midias", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imovelId: editImovel.id, url }),
    });

    if (!res.ok) {
      alert("Erro ao excluir mídia");
      return;
    }

    setPreviewUrls((prev) => prev.filter((u) => u !== url));
  }

  // Hook para setar imóvel de edição
  useEffect(() => {
    if (editImovel) {
      setSelectedTags(editImovel.tags || []);

      // Encontrar a capa corretamente
      const capaInicial = editImovel.midias.find(m => m.tipo === "capa")?.url || null;

      // Filtrar as outras mídias para preview (excluindo a capa)
      const outrasMidias = editImovel.midias
        .filter(m => m.url !== capaInicial)
        .map(m => m.url);

      setCapa(capaInicial);
      setPreviewUrls(outrasMidias);
      setCapaFile(null);
      setSelectedFiles([]);
    } else {
      setSelectedTags([]);
      setPreviewUrls([]);
      setCapa(null);
      setCapaFile(null);
      setSelectedFiles([]);
    }
  }, [editImovel]);


  // Hook para fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    if (modalOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [modalOpen]);

  const aplicarFiltros = useCallback((filtros: Filtros) => {
    let filtrados = imoveis; // imoveis aqui é a referência estável do estado original

    // Filtros de texto
    if (filtros.tipo) {
      filtrados = filtrados.filter(i => i.tipo === filtros.tipo);
    }

    if (filtros.nome?.trim()) {
      const nome = filtros.nome.toLowerCase();
      filtrados = filtrados.filter(i => i.nome.toLowerCase().includes(nome));
    }

    if (filtros.endereco?.trim()) {
      const endereco = filtros.endereco.toLowerCase();
      filtrados = filtrados.filter(i => i.endereco.toLowerCase().includes(endereco));
    }

    if (filtros.cidade?.trim()) {
      const cidade = filtros.cidade.toLowerCase();
      filtrados = filtrados.filter(i => i.cidade.toLowerCase().includes(cidade));
    }

    if (filtros.estado?.trim()) {
      const estado = filtros.estado.toLowerCase();
      filtrados = filtrados.filter(i => i.estado.toLowerCase().includes(estado));
    }

    // Filtros numéricos
    const { valorMin, valorMax, quartos, banheiros, vagas, metrosMin, metrosMax, lancamento, tags } = filtros;

    if (valorMin !== undefined) filtrados = filtrados.filter(i => i.valor >= valorMin);
    if (valorMax !== undefined) filtrados = filtrados.filter(i => i.valor <= valorMax);
    if (quartos !== undefined) filtrados = filtrados.filter(i => i.quartos >= quartos);
    if (banheiros !== undefined) filtrados = filtrados.filter(i => i.banheiros >= banheiros);
    if (vagas !== undefined) filtrados = filtrados.filter(i => i.vagas >= vagas);
    if (metrosMin !== undefined) filtrados = filtrados.filter(i => i.metrosQuadrados >= metrosMin);
    if (metrosMax !== undefined) filtrados = filtrados.filter(i => i.metrosQuadrados <= metrosMax);

    // Filtro booleano
    if (lancamento) filtrados = filtrados.filter(i => i.lancamento);

    // Filtro de tags
    if (tags && tags.length > 0) {
      console.log(tags)
      console.log(filtrados)
      filtrados = filtrados.filter(i =>
        tags.every(tag => i.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
      );
    }

    setImoveisFiltrados(filtrados);
  }, [imoveis]);

  return (
    <div className={styles.dashboard}>

      <Header
        admin={true}
        onAddImovel={() => {
          setEditImovel(null);
          setModalOpen(true);
        }}
      />

      <main className={styles.content}>
        <FiltroImoveis onFilterChange={aplicarFiltros} tags={tags} />
        <div className={styles.cardsGrid}>
          {imoveisFiltrados
            .map((imovel) => (
              <PropertyCard
                lancamento={imovel.lancamento}
                key={imovel.id}
                busca={true}
                id={imovel.id}
                image={imovel.midias?.find(m => m.tipo === "capa")?.url || ""}
                price={imovel.valor}
                title={imovel.nome}
                location={`${imovel.endereco} / ${imovel.cidade} / ${imovel.estado}`}
                quartos={imovel.quartos}
                banheiros={imovel.banheiros}
                area={`${imovel.metrosQuadrados} m²`}
                isAdmin
                onGoClick={() => {
                  setEditImovel(imovel);
                  setModalOpen(true);
                }}
                onDeleteClick={() => excluirImovel(imovel.id)}
              />

            ))}
        </div>
      </main>

      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>{editImovel ? "Editar Imóvel" : "Novo Imóvel"}</h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setModalOpen(false)}
              >
                <Image
                  src="/assets/x-circle.svg"
                  alt="x-circle-icon"
                  width={32}
                  height={32}
                  className={styles.closeIcon}
                />

              </button>
            </div>

            <form onSubmit={salvarImovel} className={styles.form}>
              {/* Upload da capa */}
              <div className={styles.field}>
                <input
                  id="capa"
                  type="file"
                  accept="image/*"
                  ref={capaInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setCapa(URL.createObjectURL(file));
                    setCapaFile(file);
                  }}
                />
                <div
                  className={styles.previewCapa}
                  onClick={() => capaInputRef.current?.click()}
                >
                  {capa ? (
                    <Image
                      src={capa}
                      alt="Capa do imóvel"
                      width={900}
                      height={400}
                      className={styles.capaImovel}
                    />
                  ) : (
                    <div className={styles.capaPlaceholder}>
                      Clique para selecionar a capa
                    </div>
                  )}
                </div>
              </div>

              {/* Campos do formulário */}
              <div className={styles.contentForm}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="nome">Nome</label>
                    <input
                      id="nome"
                      name="nome"
                      placeholder="Nome"
                      defaultValue={editImovel?.nome}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="tipo">Tipo</label>
                    <select
                      id="tipo"
                      name="tipo"
                      defaultValue={editImovel?.tipo || ""}
                      required
                    >
                      <option value="" disabled>
                        Selecione o tipo
                      </option>
                      <option value="Casa">Casa</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Sobrado">Sobrado</option>
                      <option value="Kitnet">Kitnet</option>
                      <option value="Cobertura">Cobertura</option>
                      <option value="Terreno">Terreno</option>
                    </select>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="valor">Valor (R$)</label>
                    <input
                      id="valor"
                      name="valor"
                      type="number"
                      placeholder="Valor"
                      defaultValue={editImovel?.valor}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="metrosQuadrados">Área (m²)</label>
                    <input
                      id="metrosQuadrados"
                      name="metrosQuadrados"
                      type="number"
                      required
                      placeholder="Área (m²)"
                      defaultValue={editImovel?.metrosQuadrados}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="cidade">Cidade</label>
                    <input
                      id="cidade"
                      name="cidade"
                      placeholder="Cidade"
                      defaultValue={editImovel?.cidade}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="estado">Estado</label>
                    <select
                      id="estado"
                      name="estado"
                      defaultValue={editImovel?.estado || ""}
                      required
                    >
                      <option value="" disabled>
                        Selecione o estado
                      </option>
                      <option value="AC">Acre (AC)</option>
                      <option value="AL">Alagoas (AL)</option>
                      <option value="AP">Amapá (AP)</option>
                      <option value="AM">Amazonas (AM)</option>
                      <option value="BA">Bahia (BA)</option>
                      <option value="CE">Ceará (CE)</option>
                      <option value="DF">Distrito Federal (DF)</option>
                      <option value="ES">Espírito Santo (ES)</option>
                      <option value="GO">Goiás (GO)</option>
                      <option value="MA">Maranhão (MA)</option>
                      <option value="MT">Mato Grosso (MT)</option>
                      <option value="MS">Mato Grosso do Sul (MS)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="PA">Pará (PA)</option>
                      <option value="PB">Paraíba (PB)</option>
                      <option value="PR">Paraná (PR)</option>
                      <option value="PE">Pernambuco (PE)</option>
                      <option value="PI">Piauí (PI)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                      <option value="RN">Rio Grande do Norte (RN)</option>
                      <option value="RS">Rio Grande do Sul (RS)</option>
                      <option value="RO">Rondônia (RO)</option>
                      <option value="RR">Roraima (RR)</option>
                      <option value="SC">Santa Catarina (SC)</option>
                      <option value="SP">São Paulo (SP)</option>
                      <option value="SE">Sergipe (SE)</option>
                      <option value="TO">Tocantins (TO)</option>
                    </select>
                  </div>

                </div>

                <div className={styles.field}>
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    id="endereco"
                    name="endereco"
                    required
                    placeholder="Endereço"
                    defaultValue={editImovel?.endereco}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="quartos">Quartos</label>
                    <input
                      id="quartos"
                      name="quartos"
                      type="number"
                      required
                      placeholder="Quartos"
                      defaultValue={editImovel?.quartos}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="banheiros">Banheiros</label>
                    <input
                      id="banheiros"
                      name="banheiros"
                      type="number"
                      required
                      placeholder="Banheiros"
                      defaultValue={editImovel?.banheiros}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="vagas">Vagas</label>
                    <input
                      id="vagas"
                      name="vagas"
                      type="number"
                      required
                      placeholder="Vagas"
                      defaultValue={editImovel?.vagas}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    required
                    name="descricao"
                    placeholder="Descrição"
                    defaultValue={editImovel?.descricao}
                  />
                </div>

                {/* Checkbox de Lançamento */}
                <div className={styles.field}>
                  <CustomCheckbox
                    id="lancamento"
                    label="Lançamento"
                    checked={editImovel ? !!editImovel.lancamento : novoLancamento}
                    onChange={() =>
                      editImovel
                        ? setEditImovel(prev => prev ? { ...prev, lancamento: !prev.lancamento } : prev)
                        : setNovoLancamento(prev => !prev)
                    }
                  />
                </div>


                {/* Tags */}
                <div className={styles.field}>
                  <label>Tags</label>
                  <div className={styles.tagsContainer}>
                    {tags.map((tag) => (
                      <CustomCheckbox
                        key={tag.id}
                        id={`tag-${tag.id}`}
                        label={tag.nome}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagChange(tag.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Mídias */}
                <div className={styles.fieldGaleria}>
                  <label htmlFor="midias">Galeria:</label>
                  {editImovel && (
                    <button
                      type="button"
                      onClick={() => document.getElementById("midias")?.click()}
                    >
                      + Adicionar mídia
                    </button>
                  )}
                  <input
                    id="midias"
                    name="midias"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{ display: editImovel ? "none" : "block" }}
                  />
                </div>

                <div className={styles.previewContainer}>
                  {previewUrls.map((url, idx) => {
                    const file = selectedFiles[idx];
                    const isVideo =
                      file
                        ? file.type.startsWith("video/")
                        : typeof url === "string" && url.endsWith(".mp4");
                    return (
                      <div key={idx} className={styles.previewItem}>
                        {isVideo ? (
                          <video src={url} controls width={100} />
                        ) : (
                          <Image
                            src={url}
                            alt={`preview-${idx}`}
                            fill
                            priority
                            className={styles.mediaImovel}
                          />

                        )}
                        {editImovel && (
                          <button
                            type="button"
                            className={styles.closeButtonMedia}
                            onClick={() => excluirMidia(url)}
                          >
                            <Image
                              src="/assets/x-circle.svg"
                              alt="x-circle-icon"
                              width={32}
                              height={32}
                              className={styles.closeIcon}
                            />

                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Ações */}
                <div className={styles.actions}>
                  <button type="submit" disabled={uploadingMidias}>
                    {uploadingMidias ? "Enviando mídias..." : "Salvar"}
                  </button>
                </div>

              </div>


            </form>
          </div>
        </div >
      )
      }

    </div >
  );
}

// ------------------- getServerSideProps -------------------

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const imoveis = await prisma.imovel.findMany({
    include: { tags: { include: { tag: true } }, midias: true },
    orderBy: { criadoEm: "desc" },
  });

  const tags = await prisma.tag.findMany();

  const imoveisSerialized: ImovelFront[] = imoveis.map((i) => ({
    id: i.id,
    tipo: i.tipo,
    nome: i.nome,
    lancamento: i.lancamento,
    valor: i.valor,
    cidade: i.cidade,
    estado: i.estado,
    endereco: i.endereco,
    quartos: i.quartos,
    banheiros: i.banheiros,
    vagas: i.vagas,
    metrosQuadrados: i.metrosQuadrados,
    descricao: i.descricao,
    criadoEm: i.criadoEm.toISOString(),
    tags: i.tags.map((t) => t.tag.id),
    midias: i.midias.map((m) => ({ url: m.url, tipo: m.tipo })),
  }));

  return { props: { session, imoveis: imoveisSerialized, tags } };
};


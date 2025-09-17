import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useUploadMidias } from "@/hooks/useUpload";
import Image from "next/image";
import { ImovelFront, Tag, Filtros } from "@/types/imovel";
import CustomCheckbox from "@/components/busca/CustomCheckbox";
import Header from "@/components/Header";
import FiltroImoveis from "@/components/busca/Filtro";
import PropertyCard from "@/components/index/PropertyCard";
import { aplicaFiltro } from "@/utils/aplicaFiltro";

interface DashboardProps {
  imoveis: ImovelFront[];
  tags: Tag[];
}

export default function Dashboard({ imoveis: initialImoveis, tags }: DashboardProps) {
  const [imoveis, setImoveis] = useState(initialImoveis);
  const [imoveisFiltrados, setImoveisFiltrados] = useState(initialImoveis);
  const [modalOpen, setModalOpen] = useState(false);
  const [editImovel, setEditImovel] = useState<ImovelFront | null>(null);

  const [capa, setCapa] = useState<string | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [novoLancamento, setNovoLancamento] = useState(false);

  const [isMobileFallback, setIsMobileFallback] = useState(false);
  const capaInputRef = useRef<HTMLInputElement>(null);

  const { upload, loading: uploadingMidias } = useUploadMidias();

  // ------------------ Funções ------------------

  async function fetchImoveis() {
    const res = await fetch("/api/imoveis");
    if (!res.ok) return alert("Erro ao buscar imóveis");
    const data: ImovelFront[] = await res.json();
    setImoveis(data);
    setImoveisFiltrados(data);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...fileArray]);

    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);

  }


  useEffect(() => { console.log(selectedFiles, capaFile); console.log(imoveis) }, [selectedFiles, capaFile]);

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
      valor: body.valor,
      quartos: Number(body.quartos || 0),
      banheiros: Number(body.banheiros || 0),
      vagas: Number(body.vagas || 0),
      metrosQuadrados: body.metrosQuadrados || 0,
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

    if (!res.ok) return alert("Erro ao salvar imóvel");

    const savedImovel = await res.json();

    // ------------------ Atualiza mídias no modo edição ------------------

    console.log(capaFile); ///

    // Upload da capa
    if (capaFile) {
      // Se estiver editando, deleta a capa antiga antes de subir a nov
      if (editImovel) {
        const capaAntiga = editImovel.midias.find((m) => m.tipo === "capa")?.url;
        if (capaAntiga) {
          await fetch("/api/midias", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imovelId: savedImovel.id, url: capaAntiga }),
          });
        }
      }
      console.log('CAIU AQUI');
      const capaUpload = await upload([capaFile]);
      if (capaUpload.length > 0) {
        console.log(capaUpload)
        await fetch("/api/midias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imovelId: savedImovel.id,
            url: capaUpload[0].url,
            tipo: "capa",
          }),
        });
      }
    }

    if (editImovel) {
      // 1️⃣ Deletar mídias removidas (exceto capa)
      const capaAtual = editImovel.midias.find((m) => m.tipo === "capa")?.url;
      const midiasParaExcluir = editImovel.midias
        .filter(m => m.url !== capaAtual) // não inclui capa
        .map(m => m.url)
        .filter(url => !previewUrls.includes(url));

      await Promise.all(
        midiasParaExcluir.map((url) =>
          fetch("/api/midias", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imovelId: savedImovel.id, url }),
          })
        )
      );

      const galeriaExistente = editImovel.midias
        .filter(m => m.tipo !== "capa")
        .map(m => m.url);

      console.log('Galeria existente:', galeriaExistente);

      // 3️⃣ Upload de novas mídias da galeria
      const novasMidiasFiles = selectedFiles.filter(file =>
        !galeriaExistente.some(url => url.endsWith(file.name))
      );

      console.log('Novas mídias selecionadas:', novasMidiasFiles);

      if (novasMidiasFiles.length > 0) {
        const uploads = await upload(novasMidiasFiles);

        await Promise.all(
          uploads.map((media, idx) =>
            fetch("/api/midias", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imovelId: savedImovel.id,
                url: media.url,
                tipo: novasMidiasFiles[idx].type.startsWith("video/") ? "video" : "imagem",
              }),
            })
          )
        );
      }

    } else {
      // ------------------ Criação de novo imóvel ------------------

      // Upload das mídias da galeria
      if (selectedFiles.length > 0) {
        const uploads = await upload(selectedFiles);
        await Promise.all(
          uploads.map((media, idx) =>
            fetch("/api/midias", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imovelId: savedImovel.id,
                url: media.url,
                tipo: selectedFiles[idx].type.startsWith("video/") ? "video" : "imagem",
              }),
            })
          )
        );
      }

    }

    // ------------------ Refresh ------------------

    await fetchImoveis();

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
    if (!res.ok) return alert("Erro ao excluir imóvel");
    await fetchImoveis();
  }

  async function excluirMidia(url: string) {
    setPreviewUrls((prev) => prev.filter((u) => u !== url));
    setSelectedFiles((prev) =>
      prev.filter((f) => URL.createObjectURL(f) !== url)
    );
    console.log(previewUrls); ///
  }

  const aplicarFiltros = useCallback(
    (filtros: Filtros) => {
      const filtrados = aplicaFiltro(imoveis, filtros);
      setImoveisFiltrados(filtrados);
    },
    [imoveis]
  );

  // ------------------ Efeitos ------------------

  useEffect(() => {
    const handleResize = () => setIsMobileFallback(window.innerWidth < 999);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (editImovel) {
      setSelectedTags(editImovel.tags || []);

      const capaInicial = editImovel.midias.find((m) => m.tipo === "capa")?.url || null;
      const outrasMidias = editImovel.midias
        .filter((m) => m.url !== capaInicial)
        .map((m) => m.url);

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
  }, [editImovel?.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setEditImovel(null);
      }
    };
    if (modalOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [modalOpen]);

  // ------------------ Render ------------------

  if (isMobileFallback) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
          padding: 20,
        }}
      >
        <div>
          <h2>Atenção!</h2>
          <p>Para editar ou adicionar imóveis, por favor utilize uma tela maior.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header
        admin
        onAddImovel={() => {
          setEditImovel(null);
          setModalOpen(true);
        }}
      />

      <main className={styles.content}>
        <FiltroImoveis onFilterChange={aplicarFiltros} tags={tags} />
        <div className={styles.cardsGrid}>
          {imoveisFiltrados.map((imovel) => (
            <PropertyCard
              key={imovel.id}
              id={imovel.id}
              lancamento={imovel.lancamento}
              busca
              image={imovel.midias?.find((m) => m.tipo === "capa")?.url || ""}
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
          onClick={() => {
            setModalOpen(false);
            setEditImovel(null);
          }}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
                    <>
                      <Image
                        src={capa}
                        alt="Capa do imóvel"
                        width={900}
                        height={400}
                        className={styles.capaImovel}
                      />
                      <div className={styles.editCapaButton}>
                        Clique para alterar a capa
                      </div>
                    </>
                  ) : (
                    <div className={styles.capaPlaceholder}>
                      Clique para selecionar a capa
                    </div>
                  )}
                </div>
              </div>

              {/* Campos do formulário */}
              <div className={styles.contentForm}>
                {/* Campos básicos */}
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
                      <option value="Condomínio">Condomínio</option>
                      <option value="Na Planta">Na Planta</option>
                      <option value="Loteamento">Loteamento</option>
                      <option value="Salas Comerciais">Salas Comerciais</option>
                    </select>
                  </div>
                </div>

                {/* Valor e área */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="valor">Valor (R$)</label>
                    <input
                      id="valor"
                      name="valor"
                      type="text"
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
                      type="text"
                      placeholder="Área (m²)"
                      defaultValue={editImovel?.metrosQuadrados}
                      required
                    />
                  </div>
                </div>

                {/* Localização */}
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
                      {[
                        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
                        "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
                      ].map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>
                </div>

                {/* Endereço */}
                <div className={styles.field}>
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    id="endereco"
                    name="endereco"
                    placeholder="Endereço"
                    defaultValue={editImovel?.endereco}
                    required
                  />
                </div>

                {/* Quartos, banheiros e vagas */}
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="quartos">Quartos</label>
                    <input
                      id="quartos"
                      name="quartos"
                      type="number"
                      placeholder="Quartos"
                      defaultValue={editImovel?.quartos}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="banheiros">Banheiros</label>
                    <input
                      id="banheiros"
                      name="banheiros"
                      type="number"
                      placeholder="Banheiros"
                      defaultValue={editImovel?.banheiros}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="vagas">Vagas</label>
                    <input
                      id="vagas"
                      name="vagas"
                      type="number"
                      placeholder="Vagas"
                      defaultValue={editImovel?.vagas}
                      required
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div className={styles.field}>
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descrição"
                    defaultValue={editImovel?.descricao}
                    required
                  />
                </div>

                {/* Lançamento */}
                <div className={styles.field}>
                  <CustomCheckbox
                    id="lancamento"
                    label="Lançamento"
                    checked={editImovel ? !!editImovel.lancamento : novoLancamento}
                    onChange={() =>
                      editImovel
                        ? setEditImovel((prev) => prev ? { ...prev, lancamento: !prev.lancamento } : prev)
                        : setNovoLancamento((prev) => !prev)
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

                {/* Galeria */}
                <div className={styles.fieldGaleria}>
                  <label htmlFor="midias">Galeria:</label>
                  <input
                    id="midias"
                    name="midias"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className={styles.previewContainer}>
                  {previewUrls.map((url, idx) => {
                    const file = selectedFiles[idx];
                    const isVideo = file?.type.startsWith("video/") || url.endsWith(".mp4");
                    return (
                      <div key={idx} className={styles.previewItem}>
                        {isVideo ? (
                          <video src={url} controls width={100} />
                        ) : (
                          <Image src={url} alt={`preview-${idx}`} fill priority className={styles.mediaImovel} />
                        )}
                        <button type="button" className={styles.closeButtonMedia} onClick={() => excluirMidia(url)}>
                          <Image src="/assets/x-circle.svg" alt="x-circle-icon" width={32} height={32} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.actions}>
                  <button type="submit" disabled={uploadingMidias}>
                    {uploadingMidias ? "Enviando mídias..." : "Salvar"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------- getServerSideProps -------------------

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

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


import { useEffect, useRef, useState } from "react";
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
  const capaInputRef = useRef<HTMLInputElement>(null);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [capa, setCapa] = useState<string | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);
  const [editImovel, setEditImovel] = useState<ImovelFront | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { upload, loading: uploadingMidias, erro: erroUpload } = useUploadMidias();

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
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    const parsedData = {
      ...body,
      valor: Number(body.valor),
      quartos: Number(body.quartos || 0),
      banheiros: Number(body.banheiros || 0),
      vagas: Number(body.vagas || 0),
      metrosQuadrados: Number(body.metrosQuadrados || 0),
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

    // Upload da capa
    let capaUrl = null;
    if (capaFile) {
      const [capaUpload] = await upload([capaFile]);
      capaUrl = capaUpload.url;
    }

    // Upload das outras mídias (excluindo a capa)
    const outrasMidias = selectedFiles.filter(f => f !== capaFile);
    const midiasUploadUrls: string[] = [];
    if (outrasMidias.length > 0) {
      const midiasUpload = await upload(outrasMidias);
      if (erroUpload) {
        alert(erroUpload);
        return;
      }
      for (const midia of midiasUpload) {
        await fetch("/api/midias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imovelId: savedImovel.id,
            url: midia.url,
            tipo: midia.tipo,
          }),
        });
        midiasUploadUrls.push(midia.url);
      }
    }

    // Atualiza o array de mídias colocando a capa em primeiro
    const updatedImovel: ImovelFront = {
      ...savedImovel,
      tags: selectedTags,
      midias: capaUrl ? [capaUrl, ...midiasUploadUrls] : [...midiasUploadUrls],
    };

    // Salva tags
    if (selectedTags.length > 0) {
      await fetch("/api/imoveltags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imovelId: savedImovel.id,
          tagIds: selectedTags,
        }),
      });
    }

    if (editImovel) {
      setImoveis((prev) =>
        prev.map((i) => (i.id === updatedImovel.id ? updatedImovel : i))
      );
    } else {
      setImoveis((prev) => [updatedImovel, ...prev]);
    }

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

    setImoveis((prev) => prev.filter((i) => i.id !== id));
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
    setEditImovel((prev) =>
      prev
        ? { ...prev, midias: prev.midias.filter((m) => m !== url) }
        : null
    );
  }

  useEffect(() => {
    if (editImovel) {
      setSelectedTags(editImovel.tags || []);
      setPreviewUrls(editImovel.midias || []);
      setCapa(editImovel.midias[0] || null);
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

  // Hook para fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    if (modalOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [modalOpen]);

  function aplicarFiltros(filtros: Filtros) {
    let filtrados = initialImoveis;

    if (filtros.tipo) filtrados = filtrados.filter(i => i.tipo === filtros.tipo);
    if (filtros.nome) filtrados = filtrados.filter(i =>
      i.nome.toLowerCase().includes(filtros.nome!.toLowerCase())
    );
    if (filtros.endereco) filtrados = filtrados.filter(i =>
      i.endereco.toLowerCase().includes(filtros.endereco!.toLowerCase())
    );
    if (filtros.cidade) filtrados = filtrados.filter(i =>
      i.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase())
    );
    if (filtros.estado) filtrados = filtrados.filter(i =>
      i.estado.toLowerCase().includes(filtros.estado!.toLowerCase())
    );
    if (filtros.valorMin !== undefined) filtrados = filtrados.filter(i => i.valor >= filtros.valorMin!);
    if (filtros.valorMax !== undefined) filtrados = filtrados.filter(i => i.valor <= filtros.valorMax!);
    if (filtros.quartos !== undefined) filtrados = filtrados.filter(i => i.quartos >= filtros.quartos!);
    if (filtros.banheiros !== undefined) filtrados = filtrados.filter(i => i.banheiros >= filtros.banheiros!);
    if (filtros.vagas !== undefined) filtrados = filtrados.filter(i => i.vagas >= filtros.vagas!);
    if (filtros.metrosMin !== undefined) filtrados = filtrados.filter(i => i.metrosQuadrados >= filtros.metrosMin!);
    if (filtros.metrosMax !== undefined) filtrados = filtrados.filter(i => i.metrosQuadrados <= filtros.metrosMax!);
    if (filtros.lancamento) filtrados = filtrados.filter(i => i.lancamento);
    if (filtros.tags && filtros.tags.length > 0) {
      filtrados = filtrados.filter(i =>
        filtros.tags!.every(tag =>
          i.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    setImoveis(filtrados);
  }

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
        <FiltroImoveis onFilterChange={aplicarFiltros} />
        <div className={styles.cardsGrid}>
          {imoveis
            .filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()))
            .map((imovel) => (
              <PropertyCard
                key={imovel.id}
                id={imovel.id}
                image={imovel.midias?.[0]}
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
                    <input
                      id="tipo"
                      name="tipo"
                      placeholder="Tipo"
                      defaultValue={editImovel?.tipo}
                      required
                    />
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
                    <input
                      id="estado"
                      name="estado"
                      placeholder="Estado"
                      defaultValue={editImovel?.estado}
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="endereco">Endereço</label>
                  <input
                    id="endereco"
                    name="endereco"
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
                      placeholder="Vagas"
                      defaultValue={editImovel?.vagas}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
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
                    checked={!!editImovel?.lancamento}
                    onChange={() =>
                      setEditImovel((prev) =>
                        prev ? { ...prev, lancamento: !prev.lancamento } : prev
                      )
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
    midias: i.midias.map((m) => m.url),
  }));

  return { props: { session, imoveis: imoveisSerialized, tags } };
};

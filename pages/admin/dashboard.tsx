import { useEffect, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useUploadMidias } from "@/hooks/useUpload";
import { ImovelFront } from "@/types/imovel";
import CustomCheckbox from "@/components/busca/CustomCheckbox";

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
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
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

    // Upload de novas mídias
    const midiasUploadUrls: string[] = [];
    if (selectedFiles.length > 0) {
      const midiasUpload = await upload(selectedFiles);
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

    const updatedImovel: ImovelFront = {
      ...savedImovel,
      tags: selectedTags,
      midias: editImovel?.midias
        ? [...editImovel.midias, ...midiasUploadUrls]
        : [...midiasUploadUrls],
    };

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

    // Chamada para API que remove a mídia do banco
    const res = await fetch("/api/midias", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imovelId: editImovel.id, url }),
    });

    if (!res.ok) {
      alert("Erro ao excluir mídia");
      return;
    }

    // Atualiza estado local
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
      setSelectedFiles([]);
    } else {
      setSelectedTags([]);
      setPreviewUrls([]);
      setSelectedFiles([]);
    }
  }, [editImovel]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>Dashboard de Imóveis</h1>
          <p>Gerencie seus imóveis de forma simples</p>
        </div>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Buscar imóvel..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            onClick={() => {
              setEditImovel(null);
              setModalOpen(true);
            }}
          >
            + Adicionar Imóvel
          </button>
        </div>
      </header>

      <div className={styles.cardsGrid}>
        {imoveis
          .filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()))
          .map((imovel) => (
            <div
              key={imovel.id}
              className={styles.card}
              onClick={() => {
                setEditImovel(imovel);
                setModalOpen(true);
              }}
            >
              <h3 className={styles.cardTitle}>{imovel.nome}</h3>
              <p>
                {imovel.tipo} - {imovel.cidade}/{imovel.estado}
              </p>
              <p>
                <b>R$ {imovel.valor.toLocaleString()}</b>
              </p>
              <p>
                {imovel.quartos}Q • {imovel.banheiros}B • {imovel.vagas}V
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  excluirImovel(imovel.id);
                }}
              >
                Excluir
              </button>
            </div>
          ))}
      </div>

      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{editImovel ? "Editar Imóvel" : "Novo Imóvel"}</h2>

            <form onSubmit={salvarImovel} className={styles.form}>
              {/* Campos do formulário */}
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
                ></textarea>
              </div>

              {/* Tags checkboxes */}
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


              {/* Input de mídias */}
              <div className={styles.field}>
                <label htmlFor="midias">Fotos/Vídeos</label>
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
                  const isVideo = file ? file.type.startsWith("video/") : (typeof url === "string" && url.endsWith(".mp4"));
                  return (
                    <div key={idx} className={styles.previewItem}>
                      {isVideo ? (
                        <video src={url} controls width={100} />
                      ) : (
                        <img src={url} alt={`preview-${idx}`} width={100} />
                      )}
                      {editImovel && (
                        <button
                          type="button"
                          onClick={() => excluirMidia(url)}
                        >
                          X
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={styles.actions}>
                <button type="submit" disabled={uploadingMidias}>
                  {uploadingMidias ? "Enviando mídias..." : "Salvar"}
                </button>
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

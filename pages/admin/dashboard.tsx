import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import type { Imovel } from "@prisma/client"; // Importa o tipo do Prisma
import styles from "../../styles/Dashboard.module.css";

export default function Dashboard() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editImovel, setEditImovel] = useState<Imovel | null>(null);

  // Buscar imóveis
  async function fetchImoveis() {
    const res = await fetch("/api/imoveis");
    const data: Imovel[] = await res.json();
    setImoveis(data);
  }

  useEffect(() => {
    fetchImoveis();
  }, []);

  async function salvarImovel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());

    if (editImovel) {
      await fetch(`/api/imoveis/${editImovel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/imoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setModalOpen(false);
    setEditImovel(null);
    fetchImoveis();
  }

  async function excluirImovel(id: string) {
    if (!confirm("Deseja excluir este imóvel?")) return;
    await fetch(`/api/imoveis/${id}`, { method: "DELETE" });
    fetchImoveis();
  }

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
          <button onClick={() => { setEditImovel(null); setModalOpen(true); }}>
            + Adicionar Imóvel
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {imoveis
          .filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()))
          .map((imovel) => (
            <div
              key={imovel.id}
              className={styles.card}
              onClick={() => { setEditImovel(imovel); setModalOpen(true); }}
            >
              <h3>{imovel.nome}</h3>
              <p>{imovel.tipo} - {imovel.cidade}/{imovel.estado}</p>
              <p><b>R$ {imovel.valor.toLocaleString()}</b></p>
              <p>{imovel.quartos}Q • {imovel.banheiros}B • {imovel.vagas}V</p>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editImovel ? "Editar Imóvel" : "Novo Imóvel"}</h2>
            <form onSubmit={salvarImovel} className={styles.form}>
              <input name="nome" placeholder="Nome" defaultValue={editImovel?.nome} required />
              <input name="tipo" placeholder="Tipo" defaultValue={editImovel?.tipo} required />
              <input name="valor" type="number" placeholder="Valor" defaultValue={editImovel?.valor} required />
              <input name="cidade" placeholder="Cidade" defaultValue={editImovel?.cidade} required />
              <input name="estado" placeholder="Estado" defaultValue={editImovel?.estado} required />
              <input name="endereco" placeholder="Endereço" defaultValue={editImovel?.endereco} />
              <input name="quartos" type="number" placeholder="Quartos" defaultValue={editImovel?.quartos} />
              <input name="banheiros" type="number" placeholder="Banheiros" defaultValue={editImovel?.banheiros} />
              <input name="vagas" type="number" placeholder="Vagas" defaultValue={editImovel?.vagas} />
              <input name="metrosQuadrados" type="number" placeholder="Área (m²)" defaultValue={editImovel?.metrosQuadrados} />
              <textarea name="descricao" placeholder="Descrição" defaultValue={editImovel?.descricao}></textarea>

              <div className={styles.actions}>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Protege a rota
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  return { props: { session } };
};


import { useState } from "react";
import type { Imovel } from "@prisma/client";
import styles from "../../styles/Dashboard.module.css";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";

interface DashboardProps {
  imoveis: Imovel[];
}

export default function Dashboard({ imoveis: initialImoveis }: DashboardProps) {
  const [imoveis, setImoveis] = useState<Imovel[]>(initialImoveis);
  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editImovel, setEditImovel] = useState<Imovel | null>(null);

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

    const updatedImovel = await res.json();

    setModalOpen(false);
    setEditImovel(null);

    // Atualiza lista no client
    if (editImovel) {
      setImoveis((prev) => prev.map((i) => (i.id === updatedImovel.id ? updatedImovel : i)));
    } else {
      setImoveis((prev) => [updatedImovel, ...prev]);
    }
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

      <div className={styles.cardsGrid}>
        {imoveis
          .filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()))
          .map((imovel) => (
            <div key={imovel.id} className={styles.card} onClick={() => { setEditImovel(imovel); setModalOpen(true); }}>
              <h3 className={styles.cardTitle}>{imovel.nome}</h3>
              <p>{imovel.tipo} - {imovel.cidade}/{imovel.estado}</p>
              <p><b>R$ {imovel.valor.toLocaleString()}</b></p>
              <p>{imovel.quartos}Q • {imovel.banheiros}B • {imovel.vagas}V</p>
              <button onClick={(e) => { e.stopPropagation(); excluirImovel(imovel.id); }}>
                Excluir
              </button>
            </div>
          ))}
      </div>

      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)} // fecha ao clicar no overlay
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // evita fechamento ao clicar dentro do modal
          >
            <h2>{editImovel ? "Editar Imóvel" : "Novo Imóvel"}</h2>

            <form onSubmit={salvarImovel} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="nome">Nome</label>
                  <input id="nome" name="nome" placeholder="Nome" defaultValue={editImovel?.nome} required />
                </div>

                <div className={styles.field}>
                  <label htmlFor="tipo">Tipo</label>
                  <input id="tipo" name="tipo" placeholder="Tipo" defaultValue={editImovel?.tipo} required />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="valor">Valor (R$)</label>
                  <input id="valor" name="valor" type="number" placeholder="Valor" defaultValue={editImovel?.valor} required />
                </div>

                <div className={styles.field}>
                  <label htmlFor="metrosQuadrados">Área (m²)</label>
                  <input id="metrosQuadrados" name="metrosQuadrados" type="number" placeholder="Área (m²)" defaultValue={editImovel?.metrosQuadrados} />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="cidade">Cidade</label>
                  <input id="cidade" name="cidade" placeholder="Cidade" defaultValue={editImovel?.cidade} required />
                </div>

                <div className={styles.field}>
                  <label htmlFor="estado">Estado</label>
                  <input id="estado" name="estado" placeholder="Estado" defaultValue={editImovel?.estado} required />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="endereco">Endereço</label>
                <input id="endereco" name="endereco" placeholder="Endereço" defaultValue={editImovel?.endereco} />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="quartos">Quartos</label>
                  <input id="quartos" name="quartos" type="number" placeholder="Quartos" defaultValue={editImovel?.quartos} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="banheiros">Banheiros</label>
                  <input id="banheiros" name="banheiros" type="number" placeholder="Banheiros" defaultValue={editImovel?.banheiros} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="vagas">Vagas</label>
                  <input id="vagas" name="vagas" type="number" placeholder="Vagas" defaultValue={editImovel?.vagas} />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" name="descricao" placeholder="Descrição" defaultValue={editImovel?.descricao}></textarea>
              </div>

              <div className={styles.actions}>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const imoveis = await prisma.imovel.findMany({
    include: { tags: { include: { tag: true } }, midias: true },
    orderBy: { criadoEm: "desc" },
  });

  const imoveisSerialized = imoveis.map((i) => ({
    ...i,
    criadoEm: i.criadoEm.toISOString(),
  }));

  return { props: { session, imoveis: imoveisSerialized } };
};


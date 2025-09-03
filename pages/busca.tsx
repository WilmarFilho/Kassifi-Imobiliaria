import React, { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FiltroImoveis from "@/components/busca/Filtro";
import ListaImoveis from "@/components/busca/ListaImoveis";
import { prisma } from "@/lib/prisma";
import type { Filtros, ImovelFront, Tag, FiltrosIniciais } from "@/types/imovel";
import styles from "@/styles/Busca.module.css";
import { GetServerSideProps } from "next";
import { aplicaFiltro } from "@/utils/aplicaFiltro";

interface BuscaProps {
  imoveisSerialized: ImovelFront[];
  tags: Tag[];
  filtrosIniciais: FiltrosIniciais;
}

export default function BuscaPage({ imoveisSerialized: initialImoveis, tags, filtrosIniciais }: BuscaProps) {
  const [imoveis, setImoveis] = useState<ImovelFront[]>(initialImoveis);

  const aplicarFiltros = useCallback((novosFiltros: Filtros) => {
    const filtrados = aplicaFiltro(initialImoveis, novosFiltros);
    setImoveis(filtrados);
  }, [initialImoveis]);

  useEffect(() => {
    if (filtrosIniciais) {
      aplicarFiltros(filtrosIniciais as Filtros);
    }
  }, [filtrosIniciais, aplicarFiltros]);


  return (
    <>
      <Header variant={true} />
      <main className={styles.content}>
        <FiltroImoveis onFilterChange={aplicarFiltros} tags={tags} filtrosIniciais={filtrosIniciais} />
        <ListaImoveis imoveis={imoveis} />
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<BuscaProps> = async (context) => {
  const { tipo, cidade, q } = context.query; // adicionar q

  const tags = await prisma.tag.findMany();

  const imoveis = await prisma.imovel.findMany({
    include: { tags: { include: { tag: true } }, midias: true },
    orderBy: { criadoEm: "desc" },
  });

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

  return {
    props: {
      imoveisSerialized,
      tags,
      filtrosIniciais: {
        tipo: tipo ? String(tipo) : null,
        cidade: cidade ? String(cidade) : null,
        q: q ? String(q) : "", // adicionar o campo q
      },
    },
  };
};


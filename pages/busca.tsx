// pages/busca.tsx
import React, { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FiltroImoveis from "@/components/busca/Filtro";
import ListaImoveis from "@/components/busca/ListaImoveis";
import type { Imovel, Filtros } from "@/types/imovel";
import styles from "@/styles/Busca.module.css"; // seu css existente

// MOCK: 10 imóveis (estrutura igual à tabela)
const MOCK_IMOVEIS: Imovel[] = [
  {
    id: "1",
    tipo: "Apartamento",
    nome: "Residencial Bela Vista",
    lancamento: true,
    valor: 450000,
    cidade: "São Paulo",
    estado: "SP",
    endereco: "Rua das Flores, 123",
    quartos: 3,
    banheiros: 2,
    vagas: 1,
    metrosQuadrados: 85,
    descricao: "Apartamento moderno em região nobre.",
    criadoEm: "2025-01-01T00:00:00Z",
    tags: ["Varanda", "Academia", "Piscina"],
    midias: ["/img/ap1-1.jpg", "/img/ap1-2.jpg"]
  },
  {
    id: "2",
    tipo: "Casa",
    nome: "Casa Jardim Europa",
    lancamento: false,
    valor: 1200000,
    cidade: "São Paulo",
    estado: "SP",
    endereco: "Av. Paulista, 500",
    quartos: 4,
    banheiros: 3,
    vagas: 2,
    metrosQuadrados: 220,
    descricao: "Casa ampla com quintal e churrasqueira.",
    criadoEm: "2024-12-10T00:00:00Z",
    tags: ["Churrasqueira", "Quintal", "Garagem"],
    midias: ["/img/casa1-1.jpg"]
  },
  {
    id: "3",
    tipo: "Apartamento",
    nome: "Edifício Central",
    lancamento: false,
    valor: 350000,
    cidade: "Campinas",
    estado: "SP",
    endereco: "Rua Central, 89",
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    metrosQuadrados: 70,
    descricao: "Apartamento bem localizado no centro.",
    criadoEm: "2025-02-01T00:00:00Z",
    tags: ["Elevador", "Portaria 24h"],
    midias: ["/img/ap2-1.jpg"]
  },
  {
    id: "4",
    tipo: "Casa",
    nome: "Casa Beira Mar",
    lancamento: true,
    valor: 2500000,
    cidade: "Florianópolis",
    estado: "SC",
    endereco: "Av. Atlântica, 400",
    quartos: 5,
    banheiros: 4,
    vagas: 3,
    metrosQuadrados: 350,
    descricao: "Casa de luxo à beira-mar com piscina.",
    criadoEm: "2025-03-01T00:00:00Z",
    tags: ["Piscina", "Vista Mar", "Churrasqueira"],
    midias: ["/img/casa2-1.jpg", "/img/casa2-2.jpg"]
  },
  {
    id: "5",
    tipo: "Apartamento",
    nome: "Residencial Bosque",
    lancamento: false,
    valor: 280000,
    cidade: "Curitiba",
    estado: "PR",
    endereco: "Rua Verde, 200",
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    metrosQuadrados: 65,
    descricao: "Apartamento compacto próximo ao centro.",
    criadoEm: "2025-01-15T00:00:00Z",
    tags: ["Sacada", "Garagem"],
    midias: ["/img/ap3-1.jpg"]
  },
  {
    id: "6",
    tipo: "Casa",
    nome: "Casa Colonial",
    lancamento: false,
    valor: 900000,
    cidade: "Belo Horizonte",
    estado: "MG",
    endereco: "Rua das Palmeiras, 50",
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    metrosQuadrados: 180,
    descricao: "Casa estilo colonial com jardim espaçoso.",
    criadoEm: "2024-11-20T00:00:00Z",
    tags: ["Jardim", "Garagem", "Varanda"],
    midias: ["/img/casa3-1.jpg"]
  },
  {
    id: "7",
    tipo: "Apartamento",
    nome: "Edifício Panorama",
    lancamento: true,
    valor: 600000,
    cidade: "Rio de Janeiro",
    estado: "RJ",
    endereco: "Av. Copacabana, 321",
    quartos: 3,
    banheiros: 2,
    vagas: 1,
    metrosQuadrados: 95,
    descricao: "Apartamento com vista panorâmica da praia.",
    criadoEm: "2025-01-05T00:00:00Z",
    tags: ["Vista Mar", "Piscina", "Academia"],
    midias: ["/img/ap4-1.jpg"]
  },
  {
    id: "8",
    tipo: "Casa",
    nome: "Casa Campo Alegre",
    lancamento: false,
    valor: 700000,
    cidade: "Gramado",
    estado: "RS",
    endereco: "Estrada do Campo, 100",
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    metrosQuadrados: 160,
    descricao: "Casa charmosa em região serrana.",
    criadoEm: "2025-02-10T00:00:00Z",
    tags: ["Lareira", "Varanda", "Quintal"],
    midias: ["/img/casa4-1.jpg"]
  },
  {
    id: "9",
    tipo: "Apartamento",
    nome: "Condomínio Estoril",
    lancamento: false,
    valor: 320000,
    cidade: "Fortaleza",
    estado: "CE",
    endereco: "Rua da Praia, 150",
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    metrosQuadrados: 72,
    descricao: "Apartamento próximo da praia.",
    criadoEm: "2025-03-15T00:00:00Z",
    tags: ["Piscina", "Elevador"],
    midias: ["/img/ap5-1.jpg"]
  },
  {
    id: "10",
    tipo: "Casa",
    nome: "Casa Montanha",
    lancamento: true,
    valor: 1500000,
    cidade: "Campos do Jordão",
    estado: "SP",
    endereco: "Av. da Serra, 900",
    quartos: 4,
    banheiros: 3,
    vagas: 3,
    metrosQuadrados: 280,
    descricao: "Casa de alto padrão na serra.",
    criadoEm: "2025-03-20T00:00:00Z",
    tags: ["Lareira", "Varanda", "Vista Montanha"],
    midias: ["/img/casa5-1.jpg"]
  }
];

export default function BuscaPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>(MOCK_IMOVEIS);

  const aplicarFiltros = useCallback((novosFiltros: Filtros) => {
    // salva filtros no estado se quiser (não obrigatório)
    // setFiltros(novosFiltros);

    const filtrados = MOCK_IMOVEIS.filter((imovel) => {
      // texto: nome ou endereco
      if (novosFiltros.nome) {
        const busca = novosFiltros.nome.toLowerCase();
        if (!(
          imovel.nome.toLowerCase().includes(busca) ||
          imovel.endereco.toLowerCase().includes(busca)
        )) return false;
      }

      if (novosFiltros.tipo && novosFiltros.tipo !== "") {
        if (imovel.tipo !== novosFiltros.tipo) return false;
      }

      if (novosFiltros.cidade && novosFiltros.cidade !== "") {
        if (!imovel.cidade.toLowerCase().includes(novosFiltros.cidade.toLowerCase())) return false;
      }

      if (novosFiltros.estado && novosFiltros.estado !== "") {
        if (imovel.estado.toLowerCase() !== novosFiltros.estado.toLowerCase()) return false;
      }

      if (typeof novosFiltros.valorMin === "number") {
        if (imovel.valor < novosFiltros.valorMin) return false;
      }

      if (typeof novosFiltros.valorMax === "number") {
        if (imovel.valor > novosFiltros.valorMax) return false;
      }

      if (typeof novosFiltros.quartos === "number") {
        if (imovel.quartos < novosFiltros.quartos) return false;
      }

      if (typeof novosFiltros.banheiros === "number") {
        if (imovel.banheiros < novosFiltros.banheiros) return false;
      }

      if (typeof novosFiltros.vagas === "number") {
        if (imovel.vagas < novosFiltros.vagas) return false;
      }

      if (typeof novosFiltros.metrosMin === "number") {
        if (imovel.metrosQuadrados < novosFiltros.metrosMin) return false;
      }

      if (typeof novosFiltros.metrosMax === "number") {
        if (imovel.metrosQuadrados > novosFiltros.metrosMax) return false;
      }

      if (typeof novosFiltros.lancamento === "boolean") {
        if (imovel.lancamento !== novosFiltros.lancamento) return false;
      }

      // TAGS: requer que o imóvel contenha todas as tags selecionadas
      if (novosFiltros.tags && novosFiltros.tags.length > 0) {
        const tagsLower = imovel.tags.map(t => t.toLowerCase());
        const allMatch = novosFiltros.tags.every(tag => tagsLower.includes(tag.toLowerCase()));
        if (!allMatch) return false;
      }

      return true;
    });

    setImoveis(filtrados);
  }, []);

  return (
    <>
      <Header variant={true} />
      <main className={styles.content}>
        <FiltroImoveis onFilterChange={aplicarFiltros} />
        <ListaImoveis imoveis={imoveis} />
      </main>
      <Footer />
    </>
  );
}
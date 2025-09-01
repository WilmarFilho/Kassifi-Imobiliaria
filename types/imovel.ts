// coloque em /types/imovel.ts
export interface Imovel {
  id: string;
  tipo: string;
  nome: string;
  lancamento: boolean;
  valor: number;
  cidade: string;
  estado: string;
  endereco: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  metrosQuadrados: number;
  descricao: string;
  criadoEm: string; // ISO string
  tags: string[];   // ex: ["Piscina","Churrasqueira"]
  midias: string[]; // urls das imagens
}

export type Filtros = {
  tipo?: string;
  nome?: string; // busca por título/nome
  endereco?: string;
  cidade?: string;
  estado?: string;
  valorMin?: number;
  valorMax?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  metrosMin?: number;
  metrosMax?: number;
  lancamento?: boolean | null;
  tags?: string[]; // lista de tags selecionadas
};



// /types/imovel.ts

export interface MidiaFront {
  url: string;
  tipo: string;
}

export interface ImovelFront {
  id: string;
  tipo: string;
  nome: string;
  lancamento: boolean;
  valor: number;
  cidade: string;
  estado: string;
  endereco: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  metrosQuadrados: number;
  descricao: string;
  criadoEm: string; // string ISO para front
  tags: string[];
  midias: MidiaFront[];
}

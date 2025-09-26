export interface MidiaFront {
  url: string;
  tipo: string;
}

export interface ImovelFront {
  id: string;
  tipo: string;
  nome: string;
  lancamento: boolean;
  valor: string;
  cidade: string;
  estado: string;
  endereco: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  metrosQuadrados: string;
  descricao: string;
  criadoEm: string;
  tags: string[];
  midias: MidiaFront[];
}

export type Filtros = {
  q?: string;
  tipo?: string;
  nome?: string; 
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
  tags?: string[]; 
};

export interface FiltrosIniciais {
  tipo: string | null;
  cidade: string | null;
}

export interface Tag {
  id: string;
  nome: string;
}
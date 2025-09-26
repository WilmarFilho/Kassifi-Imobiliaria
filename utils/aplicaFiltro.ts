import type { Filtros, ImovelFront } from "@/types/imovel";

// 🔹 Função utilitária para normalizar textos
function normalizarTexto(txt: string) {
  return txt
    .normalize("NFD")                // separa letras e acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .trim()
    .toLowerCase();
}

// 🔹 Converte string de número (pt-BR ou en-US) para float
function parseNumero(valor: string | number): number {
  if (typeof valor === "number") return valor;
  if (!valor) return 0;

  let v = valor.trim();

  // Se tiver vírgula e ponto -> supõe formato brasileiro (12.000,99)
  if (v.includes(",") && v.includes(".")) {
    v = v.replace(/\./g, "");   // remove pontos de milhar
    v = v.replace(",", ".");    // troca vírgula por ponto decimal
  }
  // Se só tiver vírgula -> formato brasileiro simples (199,99)
  else if (v.includes(",")) {
    v = v.replace(",", ".");
  }

  const num = parseFloat(v);
  return isNaN(num) ? 0 : num;
}

export function aplicaFiltro(imoveis: ImovelFront[], filtros: Filtros): ImovelFront[] {
  // 🔹 Cria propriedades auxiliares numéricas (não sobrescreve os campos originais)
  let filtrados = imoveis.map(i => ({
    ...i,
    _valorNum: parseNumero(i.valor),
    _metrosNum: parseNumero(i.metrosQuadrados)
  }));

  // Texto exato (normalizado)
  if (filtros.tipo?.trim()) {
    const tipo = normalizarTexto(filtros.tipo);
    filtrados = filtrados.filter(i => normalizarTexto(i.tipo) === tipo);
  }

  if (filtros.nome?.trim()) {
    const nome = normalizarTexto(filtros.nome);
    filtrados = filtrados.filter(i =>
      normalizarTexto(i.nome).includes(nome) ||
      normalizarTexto(i.endereco).includes(nome)
    );
  }

  if (filtros.endereco?.trim()) {
    const endereco = normalizarTexto(filtros.endereco);
    filtrados = filtrados.filter(i => normalizarTexto(i.endereco).includes(endereco));
  }

  if (filtros.cidade?.trim()) {
    const cidade = normalizarTexto(filtros.cidade);
    filtrados = filtrados.filter(i => normalizarTexto(i.cidade) === cidade);
  }

  if (filtros.estado?.trim()) {
    const estado = normalizarTexto(filtros.estado);
    filtrados = filtrados.filter(i => normalizarTexto(i.estado) === estado);
  }

  if (filtros.q?.trim()) {
    const q = normalizarTexto(filtros.q);
    filtrados = filtrados.filter(i =>
      normalizarTexto(i.endereco).includes(q) ||
      normalizarTexto(i.nome).includes(q)
    );
  }

  // Numéricos (usando auxiliares)
  const { valorMin, valorMax, quartos, banheiros, vagas, metrosMin, metrosMax, lancamento, tags } = filtros;
  if (valorMin !== undefined) filtrados = filtrados.filter(i => i._valorNum >= valorMin);
  if (valorMax !== undefined) filtrados = filtrados.filter(i => i._valorNum <= valorMax);
  if (quartos !== undefined) filtrados = filtrados.filter(i => i.quartos >= quartos);
  if (banheiros !== undefined) filtrados = filtrados.filter(i => i.banheiros >= banheiros);
  if (vagas !== undefined) filtrados = filtrados.filter(i => i.vagas >= vagas);
  if (metrosMin !== undefined) filtrados = filtrados.filter(i => i._metrosNum >= metrosMin);
  if (metrosMax !== undefined) filtrados = filtrados.filter(i => i._metrosNum <= metrosMax);

  // Booleano
  if (lancamento) filtrados = filtrados.filter(i => i.lancamento);

  // Tags (exatidão flexível)
  if (tags && tags.length > 0) {
    filtrados = filtrados.filter(i =>
      tags.every(tag =>
        i.tags.some(t => normalizarTexto(t) === normalizarTexto(tag))
      )
    );
  }

  // 🔹 Remove os auxiliares antes de retornar
  return filtrados.map(({ _valorNum, _metrosNum, ...rest }) => rest);
}

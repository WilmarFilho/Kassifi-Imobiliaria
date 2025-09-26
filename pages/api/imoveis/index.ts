import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { ImovelFront } from "@/types/imovel";

// Regex para validar números: aceita dígitos, pontos e vírgulas, qualquer combinação
const numeroValido = (str: string) => /^[0-9.,]+$/.test(str);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    if (req.method === "GET") {
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
        midias: i.midias
          .sort((a, b) => a.ordem - b.ordem)
          .map((m) => ({
            id: m.id,
            url: m.url,
            tipo: m.tipo,
            ordem: m.ordem,
          })),
      }));

      return res.status(200).json(imoveisSerialized);
    }

    if (req.method === "POST") {
      const data = req.body;

      // Verificação básica de campos obrigatórios
      const requiredFields = [
        "nome",
        "tipo",
        "valor",
        "cidade",
        "estado",
        "endereco",
        "quartos",
        "banheiros",
        "vagas",
        "descricao",
      ];

      for (const field of requiredFields) {
        if (
          data[field] === undefined ||
          data[field] === null ||
          (typeof data[field] === "string" && data[field].trim() === "")
        ) {
          return res.status(400).json({ error: `Campo obrigatório ausente: ${field}` });
        }
      }

      // Valida strings numéricas
      if (!numeroValido(data.valor)) {
        return res.status(400).json({ error: "Valor inválido" });
      }
      if (!numeroValido(data.metrosQuadrados)) {
        return res.status(400).json({ error: "Área inválida" });
      }

      const parsedData = {
        ...data,
        valor: data.valor,
        metrosQuadrados: data.metrosQuadrados,
        quartos: Number(data.quartos || 0),
        banheiros: Number(data.banheiros || 0),
        vagas: Number(data.vagas || 0),
        lancamento: Boolean(data.lancamento),
      };

      const imovel = await prisma.imovel.create({
        data: {
          ...parsedData,
          tags: parsedData.tags?.length
            ? {
              create: parsedData.tags.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            }
            : undefined,
          midias: parsedData.midias?.length
            ? {
              create: parsedData.midias.map((m: { url: string; tipo: string }) => ({
                url: m.url,
                tipo: m.tipo,
              })),
            }
            : undefined,
        },
        include: { tags: { include: { tag: true } }, midias: true },
      });

      return res.status(201).json(imovel);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error: unknown) {
    console.error("Erro API /imoveis:", error);
    return res.status(500).json({
      error: "Erro no servidor",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      console.log('oi')
      const imoveis = await prisma.imovel.findMany({
        include: {
          tags: { include: { tag: true } },
          midias: true,
        },
        orderBy: { criadoEm: "desc" },
      });
      return res.status(200).json(imoveis);
    }

    if (req.method === "POST") {
      const data = req.body;

      // Converter strings numéricas para números
      const parsedData = {
        ...data,
        valor: Number(data.valor),
        quartos: Number(data.quartos || 0),
        banheiros: Number(data.banheiros || 0),
        vagas: Number(data.vagas || 0),
        metrosQuadrados: Number(data.metrosQuadrados || 0),
        lancamento: data.lancamento ? Boolean(data.lancamento) : false
      };

      const imovel = await prisma.imovel.create({
        data: {
          ...parsedData,
          tags: parsedData.tags
            ? { create: parsedData.tags.map((tagId: string) => ({ tag: { connect: { id: tagId } } })) }
            : undefined,
          midias: parsedData.midias
            ? { create: parsedData.midias.map((m: { tipo: string; url: string }) => ({ tipo: m.tipo, url: m.url })) }
            : undefined,
        },
        include: {
          tags: { include: { tag: true } },
          midias: true,
        },
      });

      return res.status(201).json(imovel);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro API /imoveis:", error);
      return res.status(500).json({ error: "Erro no servidor", details: error.message });
    } else {
      console.error("Erro API /imoveis:", error);
      return res.status(500).json({ error: "Erro no servidor", details: String(error) });
    }
  }
}

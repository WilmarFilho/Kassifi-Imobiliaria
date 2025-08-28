import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === "PUT") {
      const data = req.body;

      // Conversão de strings para número
      const parsedData = {
        ...data,
        valor: Number(data.valor),
        quartos: Number(data.quartos || 0),
        banheiros: Number(data.banheiros || 0),
        vagas: Number(data.vagas || 0),
        metrosQuadrados: Number(data.metrosQuadrados || 0),
        lancamento: Boolean(data.lancamento), // caso queira suportar boolean
      };

      const imovel = await prisma.imovel.update({
        where: { id: id as string },
        data: {
          ...parsedData,
          tags: parsedData.tags
            ? {
              deleteMany: {},
              create: parsedData.tags.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            }
            : undefined,
          midias: parsedData.midias
            ? {
              deleteMany: {},
              create: parsedData.midias.map((m: { tipo: string; url: string }) => ({
                tipo: m.tipo,
                url: m.url,
              })),
            }
            : undefined,
        },
        include: { tags: { include: { tag: true } }, midias: true },
      });

      return res.status(200).json(imovel);
    }


    if (req.method === "DELETE") {
      await prisma.imovel.delete({ where: { id: id as string } });
      return res.status(200).json({ success: true });
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
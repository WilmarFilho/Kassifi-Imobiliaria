import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]"; // ajuste o caminho se necessário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { id } = req.query;

  try {
    if (req.method === "PUT") {
      const data = req.body;

      const parsedData = {
        ...data,
        valor: Number(data.valor),
        quartos: Number(data.quartos || 0),
        banheiros: Number(data.banheiros || 0),
        vagas: Number(data.vagas || 0),
        metrosQuadrados: Number(data.metrosQuadrados || 0),
        lancamento: Boolean(data.lancamento),
      };

      const imovel = await prisma.imovel.update({
        where: { id: id as string },
        data: {
          ...parsedData,
          tags: parsedData.tags
            ? {
                deleteMany: {},
                create: parsedData.tags.map((tagId: string) => ({ tag: { connect: { id: tagId } } })),
              }
            : undefined,
          midias: parsedData.midias
            ? {
                deleteMany: {},
                create: parsedData.midias.map((m: { tipo: string; url: string }) => ({ tipo: m.tipo, url: m.url })),
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
    console.error("Erro API /imoveis/[id]:", error);
    return res.status(500).json({ error: "Erro no servidor", details: error instanceof Error ? error.message : String(error) });
  }
}

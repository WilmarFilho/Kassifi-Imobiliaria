import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    // -------------------- UPDATE --------------------
    if (req.method === "PUT") {
      const {
        valor,
        quartos,
        banheiros,
        vagas,
        metrosQuadrados,
        lancamento,
        tags,
        ...rest
      } = req.body;

      const imovel = await prisma.imovel.update({
        where: { id },
        data: {
          ...rest,
          valor: Number(valor),
          quartos: Number(quartos || 0),
          banheiros: Number(banheiros || 0),
          vagas: Number(vagas || 0),
          metrosQuadrados: Number(metrosQuadrados || 0),
          lancamento: Boolean(lancamento),
          // Atualiza apenas tags
          tags: Array.isArray(tags)
            ? {
                deleteMany: {},
                create: tags.map((tagId: string) => ({
                  tag: { connect: { id: tagId } },
                })),
              }
            : undefined,
        },
        include: { tags: { include: { tag: true } }, midias: true },
      });

      return res.status(200).json(imovel);
    }

    // -------------------- DELETE --------------------
    if (req.method === "DELETE") {
      await prisma.imovelTag.deleteMany({ where: { imovelId: id } });
      await prisma.midia.deleteMany({ where: { imovelId: id } });
      await prisma.imovel.delete({ where: { id } });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error: unknown) {
    console.error("Erro API /imoveis/[id]:", error);
    return res.status(500).json({
      error: "Erro no servidor",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

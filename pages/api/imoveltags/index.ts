// pages/api/imoveltags/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { imovelId, tagIds } = req.body as { imovelId: string; tagIds: string[] };

      if (!imovelId || !Array.isArray(tagIds)) {
        return res.status(400).json({ error: "imovelId e tagIds são obrigatórios" });
      }

      // Remove registros antigos do imóvel (para edição)
      await prisma.imovelTag.deleteMany({
        where: { imovelId },
      });

      // Cria novos registros
      const imovelTags = await prisma.imovelTag.createMany({
        data: tagIds.map((tagId) => ({
          imovelId,
          tagId,
        })),
      });

      return res.status(200).json({ success: true, count: imovelTags.count });
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

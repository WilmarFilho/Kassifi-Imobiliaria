import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    if (req.method === "PATCH") {
      const { imovelId, ordem } = req.body;

      if (!imovelId || !ordem || !Array.isArray(ordem)) {
        return res.status(400).json({ error: "Campos obrigatórios: imovelId, ordem" });
      }

      try {
        await Promise.all(
          ordem.map((item: { id: string; ordem: number }) =>
            prisma.midia.update({
              where: { id: item.id },
              data: { ordem: item.ordem }, 

            })
          )
        );
        return res.status(200).json({ success: true });
      } catch (error: unknown) {
        console.error("Erro API /midias PATCH:", error);
        return res.status(500).json({ error: "Erro no servidor" });
      }
    }

    
    if (req.method === "POST") {
      const { imovelId, url, tipo } = req.body;
      if (!imovelId || !url || !tipo) {
        return res.status(400).json({ error: "Campos obrigatórios: imovelId, url, tipo" });
      }

      try {
        const novaMidia = await prisma.midia.create({
          data: { imovelId, url, tipo },
        });
        return res.status(201).json(novaMidia);
      } catch (error: unknown) {
        console.error("Erro API /midias POST:", error);
        return res.status(500).json({
          error: "Erro no servidor",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }


    if (req.method === "PUT") {
      const { imovelId, urlNova } = req.body;
      if (!imovelId || !urlNova) {
        return res.status(400).json({ error: "Campos obrigatórios: imovelId, urlNova" });
      }

      try {

        const midiaAtual = await prisma.midia.findFirst({ where: { imovelId, tipo: 'capa' } });

        if (!midiaAtual) {
          return res.status(404).json({ error: "Mídia não encontrada" });
        }

        // Swap de URLs
        await prisma.midia.update({ where: { id: midiaAtual.id }, data: { url: urlNova } });

        return res.status(200).json({ success: true });
      } catch (error: unknown) {
        console.error("Erro API /midias PUT:", error);
        return res.status(500).json({ error: "Erro no servidor" });
      }
    }


    if (req.method === "DELETE") {
      const { imovelId, url } = req.body;
      if (!imovelId || !url) {
        return res.status(400).json({ error: "Informe um ID de imóvel e URL válida" });
      }

      try {
        // Busca a mídia
        const midia = await prisma.midia.findFirst({
          where: { imovelId, url },
        });

        if (!midia) {
          return res.status(404).json({ error: "Mídia não encontrada" });
        }

        // Deleta a mídia
        await prisma.midia.delete({
          where: { id: midia.id },
        });

        return res.status(200).json({ success: true, deletedId: midia.id });
      } catch (error: unknown) {
        console.error("Erro API /midias DELETE:", error);
        return res.status(500).json({
          error: "Erro no servidor",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return res.status(405).json({ error: "Método não permitido" });

  } catch (error: unknown) {
    console.error("Erro API /midias:", error);
    return res.status(500).json({
      error: "Erro no servidor",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}


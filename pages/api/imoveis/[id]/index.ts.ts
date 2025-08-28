import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();

  const imovel = await prisma.imovel.update({
    where: { id: params.id },
    data: {
      ...data,
      tags: {
        deleteMany: {},
        create: data.tags?.map((tagId: string) => ({
          tag: { connect: { id: tagId } },
        })),
      },
      midias: {
        deleteMany: {},
        create: data.midias?.map((m: { tipo: string; url: string }) => ({
          tipo: m.tipo,
          url: m.url,
        })),
      },
    },
    include: { tags: { include: { tag: true } }, midias: true },
  });

  return NextResponse.json(imovel);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.imovel.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
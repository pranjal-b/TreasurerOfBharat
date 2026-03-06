import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const { id } = await params;
  const body = await request.json();
  const updated = await prisma.linkedInPost.update({
    where: { id },
    data: {
      ...(body.content !== undefined && { content: body.content }),
      ...(body.status !== undefined && {
        status: body.status,
        ...(body.status === "PUBLISHED" && { publishedAt: new Date() }),
      }),
    },
  });
  return NextResponse.json(updated);
}

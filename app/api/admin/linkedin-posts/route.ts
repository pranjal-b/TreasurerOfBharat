import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const posts = await prisma.linkedInPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ data: posts });
}

export async function POST(request: Request) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const body = await request.json();
  const post = await prisma.linkedInPost.create({
    data: {
      content: body.content,
      status: body.status ?? "DRAFT",
      sourceItemIds: body.sourceItemIds ?? null,
    },
  });
  return NextResponse.json(post);
}

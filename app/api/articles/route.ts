import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  abstract: z.string().min(1),
  body: z.string().min(1),
  tags: z.array(z.string()).optional(),
  industry: z.string().optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status"); // approved | mine | review
  const userId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;

  const where: Record<string, unknown> = {};
  if (statusFilter === "approved") {
    where.status = "APPROVED";
  } else if (statusFilter === "mine") {
    where.authorId = userId;
  } else if (statusFilter === "review" && (role === "REVIEWER" || role === "ADMIN")) {
    where.status = "UNDER_REVIEW";
    where.reviewerId = userId;
  } else {
    where.OR = [{ status: "APPROVED" }, { authorId: userId }];
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ data: articles });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const article = await prisma.article.create({
    data: {
      authorId: (session.user as { id: string }).id,
      title: parsed.data.title,
      abstract: parsed.data.abstract,
      body: parsed.data.body,
      tags: parsed.data.tags ?? [],
      industry: parsed.data.industry ?? null,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  return NextResponse.json(article);
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { requireReviewer } from "@/lib/rbac";
import { z } from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (article.status !== "APPROVED" && article.authorId !== userId && role !== "REVIEWER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(article);
}

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
  reviewerId: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.status === "APPROVED" || body.status === "REJECTED") {
    const forbidden = await requireReviewer();
    if (forbidden) return forbidden;

    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (article.status !== "UNDER_REVIEW" && article.status !== "SUBMITTED") {
      return NextResponse.json({ error: "Article not in review" }, { status: 400 });
    }

    await prisma.article.update({
      where: { id },
      data: {
        status: parsed.data.status,
        reviewerId: (session.user as { id: string }).id,
        reviewedAt: new Date(),
      },
    });

    await prisma.review.create({
      data: {
        articleId: id,
        reviewerId: (session.user as { id: string }).id,
        status: parsed.data.status,
        comment: parsed.data.comment ?? null,
      },
    });

    const updated = await prisma.article.findUnique({
      where: { id },
    });

    return NextResponse.json(updated);
  }

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAdmin = (session.user as { role?: string }).role === "ADMIN";
  const isAuthor = article.authorId === (session.user as { id?: string }).id;

  if (!isAdmin && !isAuthor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateSchema = z.object({
    title: z.string().min(1).optional(),
    abstract: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    industry: z.string().optional(),
    reviewerId: z.string().optional(),
    status: z.enum(["SUBMITTED", "UNDER_REVIEW"]).optional(),
  });

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 400 }
    );
  }

  const updated = await prisma.article.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.abstract !== undefined && { abstract: parsed.data.abstract }),
      ...(parsed.data.body !== undefined && { body: parsed.data.body }),
      ...(parsed.data.tags !== undefined && { tags: parsed.data.tags }),
      ...(parsed.data.industry !== undefined && { industry: parsed.data.industry }),
      ...(parsed.data.reviewerId !== undefined && { reviewerId: parsed.data.reviewerId }),
      ...(parsed.data.status !== undefined && {
        status: parsed.data.status,
        ...(parsed.data.status === "UNDER_REVIEW" && { submittedAt: new Date() }),
      }),
    },
  });

  return NextResponse.json(updated);
}

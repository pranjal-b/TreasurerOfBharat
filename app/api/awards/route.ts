import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

export async function GET() {
  await auth();
  const awards = await prisma.award.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ data: awards });
}

export async function POST(request: Request) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const award = await prisma.award.create({
    data: {
      name: body.name,
      eligibilityCriteria: body.eligibilityCriteria ?? null,
      categories: body.categories ?? null,
      applicationProcess: body.applicationProcess ?? null,
    },
  });
  return NextResponse.json(award);
}

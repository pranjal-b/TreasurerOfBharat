import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  await auth();
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  const where: Record<string, unknown> = {};
  if (location) where.location = { contains: location, mode: "insensitive" };

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ data: jobs });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const job = await prisma.job.create({
    data: {
      posterId: (session.user as { id: string }).id,
      title: body.title,
      company: body.company,
      location: body.location,
      experienceRequired: body.experienceRequired ?? null,
      description: body.description ?? null,
      applicationLink: body.applicationLink ?? null,
    },
  });
  return NextResponse.json(job);
}

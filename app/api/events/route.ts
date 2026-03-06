import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/rbac";

export async function GET(request: Request) {
  await auth();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const where = type ? { type } : {};
  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
    take: 100,
  });
  return NextResponse.json({ data: events });
}

export async function POST(request: Request) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const event = await prisma.event.create({
    data: {
      name: body.name,
      organizer: body.organizer,
      location: body.location,
      date: new Date(body.date),
      description: body.description ?? null,
      registrationLink: body.registrationLink ?? null,
      type: body.type ?? "CONFERENCE",
    },
  });
  return NextResponse.json(event);
}

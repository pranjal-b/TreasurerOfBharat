import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

  const items = await prisma.timelineItem.findMany({
    where: {
      OR: [{ userId: null }, { userId: (session.user as { id?: string }).id }],
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor
      ? { cursor: { id: cursor }, skip: 1 }
      : {}),
  });

  const nextCursor = items.length > limit ? items[limit - 1]?.id : null;
  const data = items.slice(0, limit);

  return NextResponse.json({ data, nextCursor });
}

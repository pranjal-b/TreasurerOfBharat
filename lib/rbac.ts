import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export type Role = "USER" | "REVIEWER" | "ADMIN";

const ROLE_ORDER: Record<Role, number> = {
  USER: 0,
  REVIEWER: 1,
  ADMIN: 2,
};

export function hasMinimumRole(userRole: Role | string | undefined, required: Role): boolean {
  if (!userRole || !(userRole in ROLE_ORDER)) return false;
  return ROLE_ORDER[userRole as Role] >= ROLE_ORDER[required];
}

export async function requireRole(required: Role): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: Role }).role;
  if (!hasMinimumRole(role, required)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function requireAdmin(): Promise<NextResponse | null> {
  return requireRole("ADMIN");
}

export async function requireReviewer(): Promise<NextResponse | null> {
  return requireRole("REVIEWER");
}

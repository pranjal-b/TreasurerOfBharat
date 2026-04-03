import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      const message =
        parsed.error.errors.map((e) => e.message).join(" ") || "Invalid request";
      return NextResponse.json({ ok: false, message }, { status: 400 });
    }

    const { email } = parsed.data;

    await prisma.waitlistEntry.create({
      data: { email: email.toLowerCase().trim() },
    });

    return NextResponse.json({
      ok: true,
      message: "You’re on the list. We’ll be in touch soon.",
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({
        ok: true,
        message: "This email is already on the waitlist. Thanks for your interest.",
      });
    }

    console.error("Waitlist error:", e);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

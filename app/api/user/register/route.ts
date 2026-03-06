import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const parsed = registerSchema.safeParse(reqBody);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join("; ") || "Validation failed";
      return NextResponse.json(
        { status: "fail", message },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) {
      return NextResponse.json({
        status: "fail",
        message: "User already exists",
      }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        image: reqBody.image ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (e) {
    console.error("Registration error:", e);
    return NextResponse.json(
      {
        status: "fail",
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

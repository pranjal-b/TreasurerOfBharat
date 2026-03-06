import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const onboardingSchema = z.object({
  userRole: z.string().min(1, "User role is required"),
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  country: z.string().optional(),
  teamSize: z.string().optional(),
  reportingStructure: z.string().optional(),
  treasuryFunctions: z.array(z.string()).optional(),
  tmsName: z.string().optional(),
  bankConnectivityMethod: z.string().optional(),
  erpIntegration: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const companyCreated = await prisma.company.create({
      data: {
        name: data.companyName,
        industry: data.industry ?? null,
        size: data.companySize ?? null,
        country: data.country ?? null,
      },
    });

    await prisma.treasuryProfile.upsert({
      where: { userId },
      create: {
        userId,
        userRole: data.userRole,
        teamSize: data.teamSize ?? null,
        reportingStructure: data.reportingStructure ?? null,
        treasuryFunctions: data.treasuryFunctions ?? null,
        tmsName: data.tmsName ?? null,
        bankConnectivityMethod: data.bankConnectivityMethod ?? null,
        erpIntegration: data.erpIntegration ?? null,
      },
      update: {
        userRole: data.userRole,
        teamSize: data.teamSize ?? null,
        reportingStructure: data.reportingStructure ?? null,
        treasuryFunctions: data.treasuryFunctions ?? null,
        tmsName: data.tmsName ?? null,
        bankConnectivityMethod: data.bankConnectivityMethod ?? null,
        erpIntegration: data.erpIntegration ?? null,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        companyId: companyCreated.id,
        onboardingCompletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Onboarding error:", e);
    return NextResponse.json(
      { error: "Failed to save onboarding" },
      { status: 500 }
    );
  }
}

"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "@/components/navigation";
import { useRouter } from "@/components/navigation";
import { useEffect } from "react";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;
    const onboardingCompleted = (session?.user as { onboardingCompletedAt?: Date | null })
      ?.onboardingCompletedAt;
    const isOnOnboarding = pathname?.includes("/onboarding");
    if (!onboardingCompleted && !isOnOnboarding) {
      const locale = pathname?.split("/")[1] || "en";
      router.replace(`/${locale}/onboarding`);
    }
  }, [status, session, pathname, router]);

  return <>{children}</>;
}

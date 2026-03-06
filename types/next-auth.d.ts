import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: string;
    onboardingCompletedAt?: Date | null;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
      onboardingCompletedAt?: Date | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

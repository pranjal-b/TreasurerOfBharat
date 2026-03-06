import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && "role" in user) {
        token.role = user.role;
        token.onboardingCompletedAt = user.onboardingCompletedAt;
        token.id = user.id;
      }
      if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, onboardingCompletedAt: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.onboardingCompletedAt = dbUser.onboardingCompletedAt;
        } else if (account?.provider && account.provider !== "credentials") {
          const created = await prisma.user.create({
            data: {
              email: token.email!,
              name: (token.name as string) || "User",
              passwordHash: await bcrypt.hash("oauth-no-password-" + Math.random(), 10),
              image: token.picture as string | null,
              role: "USER",
            },
            select: { id: true, role: true, onboardingCompletedAt: true },
          });
          token.id = created.id;
          token.role = created.role;
          token.onboardingCompletedAt = created.onboardingCompletedAt;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { onboardingCompletedAt?: Date | null }).onboardingCompletedAt =
          token.onboardingCompletedAt ? new Date(token.onboardingCompletedAt as string) : null;
      }
      return session;
    },
  },
  providers: [
    Google,
    GitHub,
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null || !credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            passwordHash: true,
            role: true,
            onboardingCompletedAt: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isMatch) {
          throw new Error("Email or Password is not correct");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          onboardingCompletedAt: user.onboardingCompletedAt,
        };
      },
    }),
  ],
});

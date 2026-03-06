import { auth } from "@/lib/auth";
import { redirect } from "@/components/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") {
    redirect({ href: "/dashboard/analytics", locale: "en" });
  }
  return <>{children}</>;
}

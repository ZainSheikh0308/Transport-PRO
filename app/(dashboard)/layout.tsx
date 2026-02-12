import { AppShell } from "@/components/app-shell";
import { requireSessionUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSessionUser();
  return <AppShell>{children}</AppShell>;
}

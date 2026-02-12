"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/records", label: "Daily Records" },
  { href: "/monthly", label: "Monthly Summary" },
  { href: "/yearly", label: "Yearly Summary" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-4">
        <aside className="card sticky top-4 h-fit w-64 p-4">
          <h1 className="text-lg font-bold text-cyan-300">TransportPro</h1>
          <p className="mt-1 text-xs text-slate-400">Smart accounting dashboard</p>
          <nav className="mt-4 flex flex-col gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active ? "bg-cyan-500/20 text-cyan-200" : "hover:bg-slate-800"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="mt-6 w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-500"
          >
            Logout
          </button>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

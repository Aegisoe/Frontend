"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/proof", label: "Proof Verifier", icon: "search" },
  { href: "/logs", label: "Incident Log", icon: "list" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-[var(--border)] bg-[var(--background)]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-[var(--border)] px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span className="font-mono text-sm font-semibold tracking-tight text-[var(--foreground)]">
          AEGISOE
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-md bg-[var(--card)]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{ICONS[item.icon]}</span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Network Badge */}
      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
          <span className="font-mono text-xs text-[var(--muted-foreground)]">
            Sepolia Testnet
          </span>
        </div>
      </div>
    </aside>
  );
}

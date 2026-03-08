"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CONTRACT_ADDRESS, CRE_OPERATOR_ADDRESS, ETHERSCAN_BASE } from "@/config/constants";
import { truncateAddress } from "@/lib/format";
import { DataModeSwitch } from "@/components/ui/DataModeSwitch";
import { useDataMode } from "@/components/providers/DataModeProvider";

const NAV_PAGES = [
  { href: "/dashboard", label: "Dashboard", icon: "\u25A6" },
  { href: "/scan", label: "Repo Scanner", icon: "\u2299" },
  { href: "/proof", label: "Proof Verifier", icon: "\u25CE" },
  { href: "/logs", label: "Incident Log", icon: "\u2261" },
] as const;

const NAV_EXTERNAL = [
  { label: "Etherscan", href: `${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}` },
  { label: "Backend API", href: "https://aegisoebe-production.up.railway.app/health" },
  { label: "GitHub", href: "https://github.com/Aegisoe" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { mode } = useDataMode();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-[228px] flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      {/* Logo */}
      <div className="border-b border-[var(--border)] px-4 pb-3.5 pt-[18px]">
        <div className="mb-0.5 flex items-center gap-[9px]">
          <Image
            src="/Logo_Aegisoe.svg"
            alt="Aegisoe Logo"
            width={30}
            height={30}
            className="flex-shrink-0"
            style={{ width: 30, height: 30 }}
            priority
          />
          <span className="font-mono text-sm font-bold tracking-[0.1em] text-[var(--text)]">
            AEGISOE
          </span>
        </div>
        <div className="pl-[39px] font-mono text-[10px] uppercase tracking-[0.07em] text-[var(--text3)]">
          Security Engine
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2.5">
        <div className="px-2 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text4)]">
          Pages
        </div>
        {NAV_PAGES.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative mb-px flex items-center gap-[9px] rounded-[7px] border px-2.5 py-2 text-[13px] font-medium no-underline transition-all duration-100 select-none ${
                isActive
                  ? "border-[var(--orange-mid)] bg-[var(--orange-dim)] text-[var(--orange)]"
                  : "border-transparent text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[7px] border border-[var(--orange-mid)] bg-[var(--orange-dim)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className={`relative z-10 w-[15px] flex-shrink-0 text-center text-[13px] ${isActive ? "opacity-100" : "opacity-70"}`}>
                {item.icon}
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-3.5 px-2 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text4)]">
          External
        </div>
        {NAV_EXTERNAL.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-px flex items-center gap-[9px] rounded-[7px] border border-transparent px-2.5 py-2 text-[13px] font-medium text-[var(--text2)] no-underline transition-all duration-100 select-none hover:bg-[var(--surface2)] hover:text-[var(--text)]"
          >
            <span className="w-[15px] flex-shrink-0 text-center text-[13px] opacity-70">&#8599;</span>
            {item.label}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-3.5 py-3">
        <div className="mb-2.5">
          <DataModeSwitch compact />
        </div>
        <div className="mb-2 flex items-center gap-[7px] rounded-[7px] border border-[var(--border)] bg-[var(--surface2)] px-2.5 py-[7px] font-mono text-[11px] text-[var(--text2)]">
          <div className="dot-pulse h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--green)]" />
          {mode === "simulate" ? "Simulation Mode" : "Sepolia Testnet"}
        </div>
        <div className="font-mono text-[10px] leading-[1.7] text-[var(--text3)]">
          Contract<br />
          <span className="text-[var(--text2)]">{truncateAddress(CONTRACT_ADDRESS)}</span><br />
          Operator<br />
          <span className="text-[var(--text2)]">{truncateAddress(CRE_OPERATOR_ADDRESS)}</span>
        </div>
      </div>
    </aside>
  );
}

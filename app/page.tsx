"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const PixelBlast = dynamic(
  () => import("@/components/ui/PixelBlast/PixelBlast"),
  { ssr: false }
);

const FEATURES = [
  {
    icon: "\u25CE",
    title: "3-Layer Detection",
    desc: "Regex pattern matching, Shannon entropy analysis, and LLM-based risk classification to detect leaked secrets with minimal false positives.",
  },
  {
    icon: "\u2726",
    title: "Confidential Rotation",
    desc: "Chainlink CRE revokes and rotates compromised secrets inside a Trusted Execution Environment. No one \u2014 not even the node operator \u2014 can see the secret.",
  },
  {
    icon: "\u2B21",
    title: "On-chain Proof",
    desc: "Every incident and rotation is recorded on Sepolia with SHA-256 commitments. Fully verifiable, fully immutable, fully transparent.",
  },
] as const;

const FLOW_STEPS = [
  { num: "01", label: "Leak Detected", desc: "GitHub push webhook triggers 3-layer secret scanner" },
  { num: "02", label: "CRE Processes", desc: "Chainlink TEE generates commitment, revokes token, rotates secret" },
  { num: "03", label: "On-chain Record", desc: "Incident + rotation proof submitted to Sepolia smart contract" },
  { num: "04", label: "Dashboard View", desc: "Real-time monitoring, proof verification, and audit trail" },
] as const;

export default function Landing() {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[var(--bg)]">
      {/* PixelBlast background — dark orange */}
      <div className="pointer-events-none absolute inset-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#7a3a0a"
          patternScale={2}
          patternDensity={0.8}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          speed={0.3}
          edgeFade={0.4}
          transparent
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex w-full items-center justify-between px-8 py-5"
      >
        <div className="flex items-center gap-2.5">
          <Image
            src="/Logo_Aegisoe.svg"
            alt="Aegisoe"
            width={28}
            height={28}
            style={{ width: 28, height: 28 }}
            priority
          />
          <span className="font-mono text-sm font-bold tracking-[0.1em] text-[var(--text)]">
            AEGISOE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Aegisoe"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[7px] border border-[var(--border)] bg-[var(--bg)]/60 px-3.5 py-[7px] font-mono text-[11px] text-[var(--text2)] backdrop-blur-sm transition-all duration-150 hover:border-[var(--border2)] hover:text-[var(--text)]"
          >
            GitHub
          </a>
          <Link
            href="/dashboard"
            className="rounded-[7px] border border-[var(--orange-mid)] bg-[var(--orange-dim)] px-4 py-[7px] font-mono text-[11px] font-semibold text-[var(--orange)] backdrop-blur-sm transition-all duration-150 hover:bg-[rgba(249,115,22,0.18)]"
          >
            Open Dashboard
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-5 flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-4 py-1.5 backdrop-blur-sm">
            <div className="dot-pulse h-1.5 w-1.5 rounded-full bg-[var(--orange)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">
              Chainlink Hackathon 2026 &middot; Privacy Track
            </span>
          </div>

          <h1 className="mb-4 font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--text)]">
            Automated Secret
            <br />
            <span className="text-[var(--orange)]">Incident Response</span>
          </h1>

          <p className="mb-8 max-w-[520px] text-[15px] leading-[1.7] text-[var(--text2)]">
            Detect leaked secrets in GitHub repos, rotate them confidentially inside Chainlink CRE, and record immutable proof on-chain.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 rounded-[8px] border border-[var(--orange)] bg-[var(--orange)] px-6 py-[11px] font-mono text-[13px] font-semibold text-[var(--bg)] transition-all duration-150 hover:bg-[#ea6710]"
            >
              Enter Dashboard
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">&rarr;</span>
            </Link>
            <a
              href="https://sepolia.etherscan.io/address/0xf497C0B1D82d6fc1deaFe63a2DB7dBe81d87Da71"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg)]/60 px-5 py-[11px] font-mono text-[13px] text-[var(--text2)] backdrop-blur-sm transition-all duration-150 hover:border-[var(--border2)] hover:text-[var(--text)]"
            >
              View Contract &#8599;
            </a>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid w-full max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 + i * 0.1 }}
              className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/90 p-5 backdrop-blur-sm transition-colors duration-150 hover:border-[var(--border2)]"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--orange-dim)] text-[var(--orange)]">
                {f.icon}
              </div>
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--text)]">{f.title}</div>
              <p className="text-[12px] leading-[1.6] text-[var(--text3)]">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 w-full max-w-[860px]"
        >
          <div className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text4)]">
            How it works
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
            {FLOW_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + i * 0.08 }}
                className="relative bg-[var(--surface)]/90 px-4 py-4 backdrop-blur-sm"
              >
                <div className="mb-2 font-mono text-[20px] font-bold text-[var(--orange)] opacity-40">{step.num}</div>
                <div className="mb-1 text-[12px] font-semibold text-[var(--text)]">{step.label}</div>
                <p className="text-[11px] leading-[1.5] text-[var(--text3)]">{step.desc}</p>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 font-mono text-[var(--text4)] sm:block">
                    &rarr;
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text4)]"
        >
          <span>Next.js</span>
          <span className="text-[var(--border2)]">/</span>
          <span>Chainlink CRE</span>
          <span className="text-[var(--border2)]">/</span>
          <span>Solidity</span>
          <span className="text-[var(--border2)]">/</span>
          <span>Sepolia</span>
          <span className="text-[var(--border2)]">/</span>
          <span>wagmi + viem</span>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-[var(--border)] bg-[var(--bg)]/80 px-8 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[var(--text4)]">
            AEGISOE &middot; Chainlink Hackathon 2026
          </span>
          <span className="font-mono text-[10px] text-[var(--text4)]">
            Sepolia &middot; 0xf497...Da71
          </span>
        </div>
      </footer>
    </div>
  );
}

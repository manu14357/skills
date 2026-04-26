"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-5 py-3.5 md:px-10 lg:px-16">
        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-text-primary">
            zskills
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.15em] text-primary sm:inline">
            registry
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Browse
          </Link>
          <a
            href="https://github.com/manu14357/zskills/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Contribute ↗
          </a>
          <Link
            href="/docs"
            className="px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Docs
          </Link>
          <Link
            href="/leaderboard"
            className="px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Leaderboard
          </Link>
          <ThemeToggle />
        </nav>

        {/* Mobile: theme + hamburger */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-border bg-bg/98 px-5 pb-5 sm:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
            >
              Browse
            </Link>
            <Link
              href="/docs"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
            >
              Docs
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
            >
              Leaderboard
            </Link>
            <a
              href="https://github.com/manu14357/zskills/fork"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-lg bg-primary px-3 py-3 text-sm font-medium text-white"
            >
              Contribute ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}


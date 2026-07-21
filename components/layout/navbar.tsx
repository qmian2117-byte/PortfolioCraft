"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LayoutDashboard, Sparkles, FolderGit2, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              Portf<span className="gradient-text">olioCraft</span>
            </span>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-muted-foreground -mt-1">
              SaaS Engine
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/#features"
            className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#tech"
            className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
          >
            Tech Stack
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/auth/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium gradient-bg text-white shadow-md shadow-indigo-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <UserPlus className="h-4 w-4" />
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

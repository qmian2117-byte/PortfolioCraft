"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Code2,
  ExternalLink,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  user: {
    name: string;
    email: string;
    role?: string;
    profile?: {
      username?: string | null;
      avatarUrl?: string | null;
    } | null;
  };
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/auth/login");
      router.refresh();
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
    { name: "Skills", href: "/dashboard/skills", icon: Code2 },
  ];

  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/profile")) return "Profile Management";
    if (pathname.includes("/projects")) return "Project Management";
    if (pathname.includes("/skills")) return "Skills Management";
    return "Dashboard";
  };

  const publicPortfolioUrl = user.profile?.username
    ? `/p/${user.profile.username}`
    : `/p/alexrivera`;

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-nav border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white hidden sm:inline-block">
                Portf<span className="gradient-text">olioCraft</span>
              </span>
            </Link>

            {/* Breadcrumb indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
              <span>Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {getBreadcrumb()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={publicPortfolioUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Public Portfolio</span>
            </Link>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 sticky top-24 space-y-6">
            {/* User Profile Mini Banner */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60">
              <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold uppercase shadow-sm shrink-0">
                {user.name?.[0] || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                      isActive
                        ? "gradient-bg text-white shadow-lg shadow-indigo-500/20 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="font-bold text-lg text-white">Dashboard Menu</div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-white hover:bg-slate-900"
              >
                <item.icon className="h-5 w-5 text-indigo-400" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

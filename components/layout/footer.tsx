import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              PortfolioCraft SaaS
            </span>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-rose-500 fill-rose-500 inline" /> using Next.js 15, TypeScript & Tailwind CSS.
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} Portfolio Management System. Production-Ready.
          </div>
        </div>
      </div>
    </footer>
  );
}

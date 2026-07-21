import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="max-w-md w-full text-center space-y-6 glass-card p-8 rounded-3xl border border-slate-800">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <FileQuestion className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-black gradient-text">404</h1>
          <h2 className="text-2xl font-bold tracking-tight text-white">Page Not Found</h2>
          <p className="text-sm text-slate-400">
            The portfolio page, project, or dashboard route you are trying to reach does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-bg text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

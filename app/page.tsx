import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Sparkles,
  ShieldCheck,
  FolderGit2,
  Code2,
  Layers,
  ArrowRight,
  Zap,
  CheckCircle2,
  Users,
  Search,
  Lock,
  Smartphone,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 lg:py-32">
          {/* Decorative Glow background elements */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Full Stack Production Portfolio SaaS
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Craft Your Developer Story with <span className="gradient-text">Precision & Style</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
              Manage your projects, showcase skills, upload rich media, and publish a modern SEO-optimized portfolio dashboard in seconds.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base gradient-bg text-white shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                Create Free Portfolio
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-md"
              >
                <Layers className="h-5 w-5 text-indigo-500" />
                Live Demo Dashboard
              </Link>
            </div>

            {/* Platform Stats Banner */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { label: "Architecture", val: "Next.js 15 App Router" },
                { label: "Type Safety", val: "100% TypeScript" },
                { label: "Database ORM", val: "Prisma & MySQL" },
                { label: "Security", val: "JWT & HTTP Cookies" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-center"
                >
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {stat.val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-20 bg-slate-100/50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Built for Production Excellence
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Everything you need from secure authentication to responsive showcase galleries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Lock,
                  title: "JWT Authentication",
                  desc: "HTTP-Only secure cookie sessions, bcrypt password hashing, login, register, and protected API routes.",
                },
                {
                  icon: FolderGit2,
                  title: "Project Management",
                  desc: "Full CRUD operations, Cloudinary/Supabase media uploads, technology tags, and demo repository links.",
                },
                {
                  icon: Code2,
                  title: "Skill Directory",
                  desc: "Categorized skill levels (Frontend, Backend, DevOps, DB), level percentage sliders, and live filters.",
                },
                {
                  icon: Search,
                  title: "Instant Search & Filters",
                  desc: "Filter projects by tech stack, category, date, or alphabetical sorting with lightning speed.",
                },
                {
                  icon: Smartphone,
                  title: "Responsive Showcase",
                  desc: "SEO-friendly public portfolio routes, dark/light theme switching, and desktop-to-mobile layouts.",
                },
                {
                  icon: ShieldCheck,
                  title: "Security & Validation",
                  desc: "Zod input validation, XSS protection, rate-limiting headers, and role-based access control.",
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Banner */}
        <section id="tech" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-muted-foreground mb-8">
              Powered by Industry Standard Stack
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
              {[
                "Next.js 15 (App Router)",
                "TypeScript",
                "Tailwind CSS",
                "Prisma ORM",
                "MySQL",
                "Zod Validation",
                "React Hook Form",
                "Framer Motion",
                "Lucide Icons",
                "Sonner Toasts",
              ].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

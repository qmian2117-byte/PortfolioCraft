import Link from "next/link";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import {
  FolderGit2,
  Code2,
  CheckCircle2,
  Sparkles,
  Plus,
  User,
  ArrowUpRight,
  Star,
  Globe,
  ExternalLink,
} from "lucide-react";

export default async function DashboardPage() {
  const token = getAuthCookie();
  const decoded = token ? await verifyJWT(token) : null;
  const userId = decoded?.userId;

  // Fetch metrics and recent items
  const [user, projects, skills] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.skill.findMany({
      where: { userId },
      orderBy: { level: "desc" },
      take: 6,
    }),
  ]);

  const totalProjects = await prisma.project.count({ where: { userId } });
  const totalSkills = await prisma.skill.count({ where: { userId } });
  const featuredProjects = await prisma.project.count({
    where: { userId, isFeatured: true },
  });

  // Calculate Profile Completion Percentage
  let completionScore = 20; // Base user account
  if (user?.profile?.title) completionScore += 20;
  if (user?.profile?.bio) completionScore += 20;
  if (totalProjects > 0) completionScore += 20;
  if (totalSkills > 0) completionScore += 20;

  const publicUrl = `/p/${user?.profile?.username || "alexrivera"}`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.profile?.title || "Full Stack Developer"} • {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard/projects?action=new"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold gradient-bg text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Link>
          <Link
            href="/dashboard/skills?action=new"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Projects",
            value: totalProjects,
            desc: `${featuredProjects} featured`,
            icon: FolderGit2,
            color: "from-indigo-500 to-purple-500",
          },
          {
            title: "Total Skills",
            value: totalSkills,
            desc: "Active tech stack tags",
            icon: Code2,
            color: "from-purple-500 to-pink-500",
          },
          {
            title: "Profile Strength",
            value: `${completionScore}%`,
            desc: completionScore === 100 ? "Fully optimized" : "Complete your details",
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-500",
          },
          {
            title: "Portfolio Status",
            value: user?.profile?.isPublic ? "Live Public" : "Draft",
            desc: "Visible via custom URL",
            icon: Globe,
            color: "from-amber-500 to-orange-500",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div
                className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}
              >
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Content: Recent Projects & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-indigo-500" />
              Recent Projects
            </h2>
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="glass-card p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">No projects created yet</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Start building your portfolio by adding your first project demo.
                </p>
              </div>
              <Link
                href="/dashboard/projects?action=new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold gradient-bg text-white shadow-md"
              >
                <Plus className="h-4 w-4" /> Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj) => {
                const techs: string[] = JSON.parse(proj.technologies || "[]");
                return (
                  <div
                    key={proj.id}
                    className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {proj.category.replace("_", " ")}
                        </span>
                        {proj.isFeatured && (
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2 line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {techs.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                      {techs.length > 3 && (
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          +{techs.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Skills (1 Col) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-purple-500" />
              Top Skills
            </h2>
            <Link
              href="/dashboard/skills"
              className="text-xs font-semibold text-purple-500 hover:underline flex items-center gap-1"
            >
              Manage <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            {skills.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No skills added yet. Add your skills to show your technical level!
              </p>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900 dark:text-white">{skill.name}</span>
                    <span className="text-indigo-500">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-bg transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Profile, Skill, Project } from "@/types";
import { toast } from "sonner";
import {
  Sparkles,
  MapPin,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Share2,
  Search,
  ExternalLink,
  Code2,
  FolderGit2,
  Star,
  Check,
  X,
  Mail,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";

interface PublicPortfolioClientProps {
  user: { name: string; email: string };
  profile: Profile;
  skills: Skill[];
  projects: (Omit<Project, "technologies"> & { technologies: string[] })[];
}

export function PublicPortfolioClient({
  user,
  profile,
  skills,
  projects,
}: PublicPortfolioClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>("ALL");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter projects
  const filteredProjects = projects.filter((proj) => {
    const matchesQuery =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" || proj.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    return (
      selectedSkillCategory === "ALL" || skill.category === selectedSkillCategory
    );
  });

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Portfolio URL copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const categoriesList = [
    { label: "All Projects", value: "ALL" },
    { label: "Full Stack", value: "FULL_STACK" },
    { label: "Web Apps", value: "WEB_APP" },
    { label: "Mobile Apps", value: "MOBILE_APP" },
    { label: "UI / UX", value: "UI_UX" },
  ];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header Card */}
      <section className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-indigo-500/30 bg-slate-900 flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-2xl">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user.name[0]
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Public Portfolio
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {user.name}
              </h1>
              <p className="text-lg font-semibold gradient-text mt-1">
                {profile.title || "Full Stack Software Engineer"}
              </p>
            </div>

            {profile.location && (
              <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                {profile.location}
              </p>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {profile.bio || "Passionate engineer crafting scalable software applications."}
            </p>

            {/* Social Links & Share Trigger */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-indigo-500 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-500 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-sky-400 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-all"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold gradient-bg text-white shadow-md hover:opacity-95 transition-all"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Resume
                </a>
              )}

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Share2 className="h-3.5 w-3.5 text-indigo-500" />
                Share Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="h-6 w-6 text-purple-500" />
              Technical Stack & Skills
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Categorized proficiencies and hands-on experience levels.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {skill.category}
                </span>
                <span className="text-xs font-extrabold text-indigo-500">
                  {skill.level}%
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {skill.name}
              </h3>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded-full gradient-bg transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="h-6 w-6 text-indigo-500" />
              Featured Projects
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explore live applications, code repositories, and architecture case studies.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {categoriesList.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? "gradient-bg text-white shadow-md"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={proj.id}
              className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
            >
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold">
                    {proj.title}
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-md border border-white/10">
                    {proj.category.replace("_", " ")}
                  </span>
                  {proj.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 shadow-md">
                      <Star className="h-3 w-3 fill-slate-950" /> Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-500 font-medium"
                      >
                        <Github className="h-3.5 w-3.5" /> GitHub
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:underline font-bold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Share Portfolio Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-400" /> Share Portfolio
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Share this live portfolio link with recruiters, hiring managers, and clients.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-400 outline-none select-all"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-4 py-2 rounded-xl text-xs font-semibold gradient-bg text-white shadow-md flex items-center gap-1"
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

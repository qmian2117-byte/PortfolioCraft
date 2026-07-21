"use client";

import { useState, useEffect } from "react";
import { Skill, SkillCategory } from "@/types";
import { toast } from "sonner";
import {
  Code2,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Loader2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

const CATEGORIES: { label: string; value: SkillCategory | "ALL" }[] = [
  { label: "All Categories", value: "ALL" },
  { label: "Frontend", value: "FRONTEND" },
  { label: "Backend", value: "BACKEND" },
  { label: "Database", value: "DATABASE" },
  { label: "DevOps", value: "DEVOPS" },
  { label: "Mobile", value: "MOBILE" },
  { label: "Design", value: "DESIGN" },
  { label: "Other", value: "OTHER" },
];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"level" | "name">("level");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<SkillCategory>("FRONTEND");
  const [formLevel, setFormLevel] = useState<number>(80);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation Delete Modal
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchSkills = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      params.set("sortBy", sortBy);

      const res = await fetch(`/api/skills?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setSkills(result.data || []);
      }
    } catch (e) {
      toast.error("Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSkill(null);
    setFormName("");
    setFormCategory("FRONTEND");
    setFormLevel(80);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormName(skill.name);
    setFormCategory(skill.category);
    setFormLevel(skill.level);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Skill name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formName,
        category: formCategory,
        level: Number(formLevel),
      };

      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.message || "Operation failed");
        setIsSubmitting(false);
        return;
      }

      toast.success(editingSkill ? "Skill updated!" : "Skill created!");
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      toast.error("Failed to save skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!deletingSkillId) return;

    try {
      const res = await fetch(`/api/skills/${deletingSkillId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Skill deleted successfully");
        fetchSkills();
      } else {
        toast.error(result.message || "Failed to delete skill");
      }
    } catch (e) {
      toast.error("Error deleting skill");
    } finally {
      setDeletingSkillId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skills Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your technical proficiencies, categories, and skill ratings.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm gradient-bg text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Skill
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "level" | "name")}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            <option value="level">Sort by Level (Highest)</option>
            <option value="name">Sort Alphabetically</option>
          </select>
        </div>
      </div>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : skills.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Code2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No skills match criteria</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add your technical skills or try adjusting your search filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {skill.category}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditModal(skill)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingSkillId(skill.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {skill.name}
                  </h3>
                  <span className="text-sm font-extrabold text-indigo-500">
                    {skill.level}%
                  </span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full gradient-bg transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Next.js, Docker, Figma"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as SkillCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  {CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Proficiency Level
                  </label>
                  <span className="text-sm font-extrabold text-indigo-400">
                    {formLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formLevel}
                  onChange={(e) => setFormLevel(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold gradient-bg text-white shadow-lg disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSkillId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full glass-card p-6 rounded-3xl border border-rose-500/20 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete Skill?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete this skill entry? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingSkillId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSkill}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

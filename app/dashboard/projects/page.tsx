"use client";

import { useState, useEffect } from "react";
import { Project, ProjectCategory } from "@/types";
import { toast } from "sonner";
import {
  FolderGit2,
  Plus,
  Search,
  Upload,
  Trash2,
  Edit2,
  ExternalLink,
  Github,
  Star,
  Loader2,
  X,
  Check,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";

const PROJECT_CATEGORIES: { label: string; value: ProjectCategory | "ALL" }[] = [
  { label: "All Categories", value: "ALL" },
  { label: "Full Stack", value: "FULL_STACK" },
  { label: "Web App", value: "WEB_APP" },
  { label: "Mobile App", value: "MOBILE_APP" },
  { label: "API Service", value: "API_SERVICE" },
  { label: "UI / UX", value: "UI_UX" },
  { label: "Open Source", value: "OPEN_SOURCE" },
  { label: "Other", value: "OTHER" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTech, setSelectedTech] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alpha">("newest");

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState<ProjectCategory>("FULL_STACK");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formGithubUrl, setFormGithubUrl] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [techTags, setTechTags] = useState<string[]>([]);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, selectedCategory, selectedTech, sortBy]);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (selectedTech !== "ALL") params.set("tech", selectedTech);
      params.set("sort", sortBy);

      const res = await fetch(`/api/projects?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setProjects(result.data || []);
      }
    } catch (e) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormDescription("");
    setFormContent("");
    setFormCategory("FULL_STACK");
    setFormImageUrl("");
    setFormGithubUrl("");
    setFormLiveUrl("");
    setFormIsFeatured(false);
    setTechTags(["Next.js", "TypeScript"]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormTitle(proj.title);
    setFormDescription(proj.description);
    setFormContent(proj.content || "");
    setFormCategory(proj.category);
    setFormImageUrl(proj.imageUrl || "");
    setFormGithubUrl(proj.githubUrl || "");
    setFormLiveUrl(proj.liveUrl || "");
    setFormIsFeatured(proj.isFeatured);
    setTechTags(proj.technologies || []);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Project image size must be under 5MB");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.message || "Image upload failed");
        setIsUploadingImage(false);
        return;
      }

      setFormImageUrl(result.data.url);
      toast.success("Project screenshot uploaded!");
    } catch (err) {
      toast.error("Image upload error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddTechTag = () => {
    if (!techInput.trim()) return;
    if (!techTags.includes(techInput.trim())) {
      setTechTags([...techTags, techInput.trim()]);
    }
    setTechInput("");
  };

  const handleRemoveTechTag = (tag: string) => {
    setTechTags(techTags.filter((t) => t !== tag));
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      toast.error("Title and Description are required");
      return;
    }
    if (techTags.length === 0) {
      toast.error("Select or enter at least one technology tag");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle,
        description: formDescription,
        content: formContent,
        category: formCategory,
        imageUrl: formImageUrl,
        githubUrl: formGithubUrl,
        liveUrl: formLiveUrl,
        isFeatured: formIsFeatured,
        technologies: techTags,
      };

      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

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

      toast.success(editingProject ? "Project updated!" : "Project created!");
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error("Error saving project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deletingProjectId) return;

    try {
      const res = await fetch(`/api/projects/${deletingProjectId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error(result.message || "Failed to delete project");
      }
    } catch (e) {
      toast.error("Error deleting project");
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Collect all unique tech stack tags for filtering dropdown
  const allTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologies || []))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Project Showcase
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, upload media, and manage portfolio project entries.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm gradient-bg text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Project
        </button>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Technologies</option>
            {allTechs.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none font-medium text-slate-700 dark:text-slate-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <FolderGit2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No projects found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add a new project or adjust your search filters to display items.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
            >
              {/* Image Banner */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="h-10 w-10" />
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

                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingProjectId(proj.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-500"
                      >
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:underline font-semibold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Project Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-32 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                    {formImageUrl ? (
                      <img
                        src={formImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-slate-600" />
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 rounded-xl text-xs font-semibold gradient-bg text-white shadow-md cursor-pointer flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {formImageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormImageUrl("")}
                        className="px-3 py-2 rounded-xl text-xs font-semibold border border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. CloudScale SaaS Engine"
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
                    onChange={(e) => setFormCategory(e.target.value as ProjectCategory)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    {PROJECT_CATEGORIES.filter((c) => c.value !== "ALL").map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Short Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Summary of the project goals and features..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                  required
                />
              </div>

              {/* Technologies Multi-Select Tags */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Technologies Used
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechTag();
                      }
                    }}
                    placeholder="Type technology (e.g. Next.js) & press Add"
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechTag}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {techTags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(t)}
                        className="hover:text-rose-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formLiveUrl}
                    onChange={(e) => setFormLiveUrl(e.target.value)}
                    placeholder="https://demo.example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  Mark as Featured Project on Portfolio Hero
                </label>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProjectId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full glass-card p-6 rounded-3xl border border-rose-500/20 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete Project?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to permanently remove this project entry?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProjectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
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

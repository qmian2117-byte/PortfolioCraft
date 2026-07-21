"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileSchema, ProfileInput } from "@/lib/validations/profile";
import {
  User,
  Upload,
  Trash2,
  Github,
  Linkedin,
  Twitter,
  Globe,
  FileText,
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      title: "",
      bio: "",
      location: "",
      phone: "",
      avatarUrl: "",
      resumeUrl: "",
      githubUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
      websiteUrl: "",
      isPublic: true,
    },
  });

  const avatarUrl = watch("avatarUrl");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const result = await res.json();

      if (res.ok && result.success && result.data) {
        const p = result.data;
        setValue("title", p.title || "");
        setValue("bio", p.bio || "");
        setValue("location", p.location || "");
        setValue("phone", p.phone || "");
        setValue("avatarUrl", p.avatarUrl || "");
        setValue("resumeUrl", p.resumeUrl || "");
        setValue("githubUrl", p.githubUrl || "");
        setValue("linkedinUrl", p.linkedinUrl || "");
        setValue("twitterUrl", p.twitterUrl || "");
        setValue("websiteUrl", p.websiteUrl || "");
        setValue("isPublic", p.isPublic ?? true);
      }
    } catch (e) {
      toast.error("Failed to load profile details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client side size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image size must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.message || "Failed to upload avatar");
        setIsUploadingAvatar(false);
        return;
      }

      setValue("avatarUrl", result.data.url);
      toast.success("Profile image uploaded!");
    } catch (err) {
      toast.error("Avatar upload failed");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = () => {
    setValue("avatarUrl", "");
    toast.info("Profile picture removed");
  };

  const onSubmit = async (data: ProfileInput) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.message || "Failed to update profile");
        setIsSaving(false);
        return;
      }

      toast.success("Profile updated successfully!");
    } catch (e) {
      toast.error("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profile Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your public portfolio identity, resume, and social profiles.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Picture Upload Section */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-500" />
            Profile Picture
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="h-28 w-28 rounded-3xl overflow-hidden border-2 border-indigo-500/30 bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-slate-500" />
                )}
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold gradient-bg text-white shadow-md cursor-pointer hover:opacity-95 transition-all">
                  <Upload className="h-3.5 w-3.5" />
                  Upload New Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPEG, PNG, WEBP, SVG (Max 5MB).
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Professional Title
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="Senior Full Stack Software Engineer"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Location
              </label>
              <input
                {...register("location")}
                type="text"
                placeholder="San Francisco, CA"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Biography
            </label>
            <textarea
              {...register("bio")}
              rows={4}
              placeholder="Tell your professional story, background, and passions..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-y"
            />
            {errors.bio && (
              <p className="text-xs text-rose-500 mt-1">{errors.bio.message}</p>
            )}
          </div>
        </div>

        {/* Social Links & Resume */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Social Accounts & Resume
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5" /> GitHub URL
              </label>
              <input
                {...register("githubUrl")}
                type="url"
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-blue-500" /> LinkedIn URL
              </label>
              <input
                {...register("linkedinUrl")}
                type="url"
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Twitter className="h-3.5 w-3.5 text-sky-400" /> Twitter / X URL
              </label>
              <input
                {...register("twitterUrl")}
                type="url"
                placeholder="https://twitter.com/username"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-500" /> Personal Website URL
              </label>
              <input
                {...register("websiteUrl")}
                type="url"
                placeholder="https://yourdomain.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-purple-500" /> Resume / CV Link
            </label>
            <input
              {...register("resumeUrl")}
              type="url"
              placeholder="https://example.com/resume.pdf"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm gradient-bg text-white shadow-xl shadow-indigo-500/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

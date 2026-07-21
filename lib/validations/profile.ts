import { z } from "zod";

export const profileSchema = z.object({
  title: z.string().max(100, "Title cannot exceed 100 characters").optional().or(z.literal("")),
  bio: z.string().max(2000, "Bio cannot exceed 2000 characters").optional().or(z.literal("")),
  location: z.string().max(100).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  avatarUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  resumeUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  websiteUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
});

export type ProfileInput = z.infer<typeof profileSchema>;

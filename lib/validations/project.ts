import { z } from "zod";

export const projectCategoryEnum = z.enum([
  "WEB_APP",
  "MOBILE_APP",
  "FULL_STACK",
  "API_SERVICE",
  "UI_UX",
  "OPEN_SOURCE",
  "OTHER",
]);

export const projectSchema = z.object({
  title: z.string().min(2, "Project title must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
  category: projectCategoryEnum,
  technologies: z.array(z.string()).min(1, "Select at least one technology tag"),
  isFeatured: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;

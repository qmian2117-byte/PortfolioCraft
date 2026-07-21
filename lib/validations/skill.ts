import { z } from "zod";

export const skillCategoryEnum = z.enum([
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "MOBILE",
  "DESIGN",
  "OTHER",
]);

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(50, "Skill name too long"),
  category: skillCategoryEnum,
  level: z.number().min(1, "Minimum level is 1%").max(100, "Maximum level is 100%"),
  iconName: z.string().optional().or(z.literal("")),
});

export type SkillInput = z.infer<typeof skillSchema>;

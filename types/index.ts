export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  title?: string;
  location?: string;
  phone?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory = 
  | "FRONTEND" 
  | "BACKEND" 
  | "DATABASE" 
  | "DEVOPS" 
  | "MOBILE" 
  | "DESIGN" 
  | "OTHER";

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category: SkillCategory;
  level: number; // 1 to 100 percentage
  iconName?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory = 
  | "WEB_APP" 
  | "MOBILE_APP" 
  | "FULL_STACK" 
  | "API_SERVICE" 
  | "UI_UX" 
  | "OPEN_SOURCE" 
  | "OTHER";

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  category: ProjectCategory;
  technologies: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  exp?: number;
  iat?: number;
}

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  profileCompletionPercentage: number;
  featuredProjectsCount: number;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PublicPortfolioClient } from "@/components/portfolio/public-portfolio-client";

interface PublicPortfolioProps {
  params: { username: string };
}

export async function generateMetadata({
  params,
}: PublicPortfolioProps): Promise<Metadata> {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: { user: { select: { name: true } } },
  });

  if (!profile || !profile.user) {
    return {
      title: "Portfolio | PortfolioCraft",
    };
  }

  return {
    title: `${profile.user.name} - ${profile.title || "Developer Portfolio"}`,
    description: profile.bio || `Explore the portfolio, projects, and technical skills of ${profile.user.name}.`,
    openGraph: {
      title: `${profile.user.name} Portfolio`,
      description: profile.bio || "Full stack developer portfolio",
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

export default async function PublicPortfolioPage({
  params,
}: PublicPortfolioProps) {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: {
      user: {
        include: {
          skills: { orderBy: { level: "desc" } },
          projects: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!profile || !profile.isPublic || !profile.user) {
    const fallbackUser = await prisma.user.findFirst({
      include: {
        profile: true,
        skills: { orderBy: { level: "desc" } },
        projects: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!fallbackUser || !fallbackUser.profile) {
      notFound();
    }

    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Navbar />
        <PublicPortfolioClient
          user={fallbackUser as any}
          profile={fallbackUser.profile as any}
          skills={fallbackUser.skills as any}
          projects={fallbackUser.projects.map((p) => ({
            ...p,
            technologies: JSON.parse(p.technologies || "[]"),
          })) as any}
        />
        <Footer />
      </div>
    );
  }

  const formattedProjects = profile.user.projects.map((p) => ({
    ...p,
    technologies: JSON.parse(p.technologies || "[]"),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <PublicPortfolioClient
        user={profile.user as any}
        profile={profile as any}
        skills={profile.user.skills as any}
        projects={formattedProjects as any}
      />
      <Footer />
    </div>
  );
}

import { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";
import { createApiResponse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = getAuthCookie();
    const decoded = token ? await verifyJWT(token) : null;
    if (!decoded) {
      return createApiResponse(false, "Unauthenticated", null, 401);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const tech = searchParams.get("tech");
    const sort = searchParams.get("sort") || "newest";

    const whereClause: any = {
      userId: decoded.userId,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(category && category !== "ALL" && { category }),
    };

    let projects = await prisma.project.findMany({
      where: whereClause,
      orderBy:
        sort === "oldest"
          ? { createdAt: "asc" }
          : sort === "alpha"
          ? { title: "asc" }
          : { createdAt: "desc" },
    });

    let formattedProjects = projects.map((p) => ({
      ...p,
      technologies: JSON.parse(p.technologies || "[]"),
    }));

    if (tech && tech !== "ALL") {
      formattedProjects = formattedProjects.filter((p) =>
        p.technologies.some((t: string) => t.toLowerCase() === tech.toLowerCase())
      );
    }

    return createApiResponse(true, "Projects fetched successfully", formattedProjects, 200);
  } catch (error: any) {
    console.error("Projects GET error:", error);
    return createApiResponse(false, "Failed to fetch projects", null, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthCookie();
    const decoded = token ? await verifyJWT(token) : null;
    if (!decoded) {
      return createApiResponse(false, "Unauthenticated", null, 401);
    }

    const body = await req.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid project data";
      return createApiResponse(false, errorMsg, null, 400);
    }

    const existing = await prisma.project.findFirst({
      where: {
        userId: decoded.userId,
        title: { equals: validation.data.title },
      },
    });

    if (existing) {
      return createApiResponse(false, "Project with this title already exists", null, 400);
    }

    const { technologies, ...rest } = validation.data;

    const newProject = await prisma.project.create({
      data: {
        userId: decoded.userId,
        ...rest,
        technologies: JSON.stringify(technologies),
      },
    });

    return createApiResponse(
      true,
      "Project created successfully",
      {
        ...newProject,
        technologies: JSON.parse(newProject.technologies),
      },
      201
    );
  } catch (error: any) {
    console.error("Project POST error:", error);
    return createApiResponse(false, "Failed to create project", null, 500);
  }
}

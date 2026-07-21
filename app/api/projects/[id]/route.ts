import { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";
import { createApiResponse } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return createApiResponse(false, "Project not found", null, 404);
    }

    return createApiResponse(
      true,
      "Project fetched successfully",
      {
        ...project,
        technologies: JSON.parse(project.technologies || "[]"),
      },
      200
    );
  } catch (error: any) {
    return createApiResponse(false, "Failed to fetch project", null, 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthCookie();
    const decoded = token ? await verifyJWT(token) : null;
    if (!decoded) {
      return createApiResponse(false, "Unauthenticated", null, 401);
    }

    const { id } = params;
    const body = await req.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid payload";
      return createApiResponse(false, errorMsg, null, 400);
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== decoded.userId) {
      return createApiResponse(false, "Project not found or access forbidden", null, 404);
    }

    const { technologies, ...rest } = validation.data;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        technologies: JSON.stringify(technologies),
      },
    });

    return createApiResponse(
      true,
      "Project updated successfully",
      {
        ...updated,
        technologies: JSON.parse(updated.technologies),
      },
      200
    );
  } catch (error: any) {
    return createApiResponse(false, "Failed to update project", null, 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthCookie();
    const decoded = token ? await verifyJWT(token) : null;
    if (!decoded) {
      return createApiResponse(false, "Unauthenticated", null, 401);
    }

    const { id } = params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== decoded.userId) {
      return createApiResponse(false, "Project not found or access forbidden", null, 404);
    }

    await prisma.project.delete({ where: { id } });
    return createApiResponse(true, "Project deleted successfully", null, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to delete project", null, 500);
  }
}

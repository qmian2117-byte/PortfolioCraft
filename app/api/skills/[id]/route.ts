import { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations/skill";
import { createApiResponse } from "@/lib/utils";

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
    const validation = skillSchema.safeParse(body);

    if (!validation.success) {
      return createApiResponse(false, "Invalid input data", null, 400);
    }

    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill || skill.userId !== decoded.userId) {
      return createApiResponse(false, "Skill not found or access forbidden", null, 404);
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: validation.data,
    });

    return createApiResponse(true, "Skill updated successfully", updatedSkill, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to update skill", null, 500);
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
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill || skill.userId !== decoded.userId) {
      return createApiResponse(false, "Skill not found or access forbidden", null, 404);
    }

    await prisma.skill.delete({ where: { id } });
    return createApiResponse(true, "Skill deleted successfully", null, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to delete skill", null, 500);
  }
}

import { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validations/skill";
import { createApiResponse } from "@/lib/utils";

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
    const sortBy = searchParams.get("sortBy") || "level"; // 'level' | 'name'

    const whereClause: any = {
      userId: decoded.userId,
      ...(search && {
        name: { contains: search },
      }),
      ...(category && category !== "ALL" && { category }),
    };

    const skills = await prisma.skill.findMany({
      where: whereClause,
      orderBy: sortBy === "name" ? { name: "asc" } : { level: "desc" },
    });

    return createApiResponse(true, "Skills retrieved successfully", skills, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to fetch skills", null, 500);
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
    const validation = skillSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid skill data";
      return createApiResponse(false, errorMsg, null, 400);
    }

    // Check duplicate entry for same user
    const existing = await prisma.skill.findFirst({
      where: {
        userId: decoded.userId,
        name: { equals: validation.data.name },
      },
    });

    if (existing) {
      return createApiResponse(false, "Skill with this name already exists", null, 400);
    }

    const newSkill = await prisma.skill.create({
      data: {
        userId: decoded.userId,
        ...validation.data,
      },
    });

    return createApiResponse(true, "Skill created successfully", newSkill, 201);
  } catch (error: any) {
    console.error("Skill POST error:", error);
    return createApiResponse(false, "Failed to create skill", null, 500);
  }
}

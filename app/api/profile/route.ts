import { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/profile";
import { createApiResponse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = getAuthCookie();
    const decoded = token ? await verifyJWT(token) : null;
    if (!decoded) {
      return createApiResponse(false, "Unauthenticated", null, 401);
    }

    let profile = await prisma.profile.findUnique({
      where: { userId: decoded.userId },
      include: { user: { select: { name: true, email: true, role: true } } },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: decoded.userId,
          title: "Software Developer",
          bio: "Welcome to my portfolio",
        },
        include: { user: { select: { name: true, email: true, role: true } } },
      });
    }

    return createApiResponse(true, "Profile retrieved successfully", profile, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to fetch profile", null, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getAuthCookie();
    const decoded = token ? await verifyJWT(token) : null;
    if (!decoded) {
      return createApiResponse(false, "Unauthenticated", null, 401);
    }

    const body = await req.json();
    const validation = profileSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Validation failed";
      return createApiResponse(false, errorMsg, null, 400);
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: decoded.userId },
      update: validation.data,
      create: {
        userId: decoded.userId,
        ...validation.data,
      },
    });

    return createApiResponse(true, "Profile updated successfully", updatedProfile, 200);
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return createApiResponse(false, "Failed to update profile", null, 500);
  }
}

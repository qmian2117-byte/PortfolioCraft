import { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { createApiResponse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = getAuthCookie();
    if (!token) {
      return createApiResponse(false, "Unauthenticated session", null, 401);
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return createApiResponse(false, "Invalid or expired session token", null, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return createApiResponse(false, "User profile not found", null, 404);
    }

    return createApiResponse(true, "User profile fetched successfully", { user }, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to retrieve user profile", null, 500);
  }
}

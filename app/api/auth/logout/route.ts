import { NextRequest } from "next/server";
import { removeAuthCookie } from "@/lib/auth/cookies";
import { createApiResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    removeAuthCookie();
    return createApiResponse(true, "Logged out successfully", null, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to log out", null, 500);
  }
}

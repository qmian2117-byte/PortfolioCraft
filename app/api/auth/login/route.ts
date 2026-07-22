import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signJWT } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { loginSchema } from "@/lib/validations/auth";
import { createApiResponse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid input data";
      return createApiResponse(false, errorMsg, null, 400);
    }

    const { email, password, rememberMe } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      return createApiResponse(false, "Invalid email or password", null, 401);
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return createApiResponse(false, "Invalid email or password", null, 401);
    }

    const token = await signJWT(
      {
        userId: user.id,
        email: user.email,
        role: user.role as any,
        name: user.name,
      },
      rememberMe ? "30d" : "7d"
    );

    setAuthCookie(token, !!rememberMe);

    const { password: _, ...userWithoutPassword } = user;

    return createApiResponse(
      true,
      "Logged in successfully",
      { user: userWithoutPassword, token },
      200
    );
  } catch (error: any) {
    console.error("Login Error:", error);
    const errorMessage = error?.message || "Internal Server Error during login";
    return createApiResponse(false, `Server error: ${errorMessage}`, null, 500);
  }
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signJWT } from "@/lib/auth/jwt";
import { setAuthCookie } from "@/lib/auth/cookies";
import { registerSchema } from "@/lib/validations/auth";
import { createApiResponse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid input data";
      return createApiResponse(false, errorMsg, null, 400);
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return createApiResponse(false, "User with this email already exists", null, 400);
    }

    const hashedPassword = await hashPassword(password);
    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "USER" as any,
        profile: {
          create: {
            username,
            title: "Software Developer",
            bio: "Welcome to my portfolio!",
            isPublic: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    const token = await signJWT({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as any,
      name: newUser.name,
    });

    setAuthCookie(token, false);

    return createApiResponse(
      true,
      "Account registered successfully",
      { user: newUser, token },
      201
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    const errorMessage = error?.message || "Internal Server Error during registration";
    return createApiResponse(false, `Server error: ${errorMessage}`, null, 500);
  }
}

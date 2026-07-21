import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { createApiResponse } from "@/lib/utils";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return createApiResponse(false, "Invalid email format", null, 400);
    }

    const { email } = validation.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return 200 to prevent email enumeration
      return createApiResponse(
        true,
        "If an account with that email exists, a password reset link has been generated",
        { token: "mock_demo_reset_token" },
        200
      );
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    return createApiResponse(
      true,
      "Password reset token created successfully",
      { resetToken: token, message: "For development, use this reset token directly." },
      200
    );
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return createApiResponse(false, "Internal Server Error", null, 500);
  }
}

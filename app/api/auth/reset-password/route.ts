import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { createApiResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      const errorMsg = validation.error.errors[0]?.message || "Invalid payload";
      return createApiResponse(false, errorMsg, null, 400);
    }

    const { token, password } = validation.data;

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return createApiResponse(false, "Invalid or expired reset token", null, 400);
    }

    const hashedPassword = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetRecord.id },
      }),
    ]);

    return createApiResponse(true, "Password has been reset successfully. Please log in.", null, 200);
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return createApiResponse(false, "Internal Server Error", null, 500);
  }
}

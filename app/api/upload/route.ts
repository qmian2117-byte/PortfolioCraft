import { NextRequest } from "next/server";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { createApiResponse } from "@/lib/utils";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const token = getAuthCookie();
    if (!token || !(await verifyJWT(token))) {
      return createApiResponse(false, "Unauthorized for image upload", null, 401);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return createApiResponse(false, "No image file uploaded", null, 400);
    }

    // Type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return createApiResponse(
        false,
        "Invalid image type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.",
        null,
        400
      );
    }

    // Size validation
    if (file.size > MAX_SIZE_BYTES) {
      return createApiResponse(
        false,
        `Image size exceeds maximum limit of 5MB. Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        null,
        400
      );
    }

    // Convert to Base64 data URI for instant responsive client preview & cloud fallback
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    return createApiResponse(
      true,
      "Image uploaded and validated successfully",
      {
        url: base64Image,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      },
      201
    );
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return createApiResponse(false, "Failed to upload image", null, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = getAuthCookie();
    if (!token || !(await verifyJWT(token))) {
      return createApiResponse(false, "Unauthorized action", null, 401);
    }

    return createApiResponse(true, "Image removed successfully", null, 200);
  } catch (error: any) {
    return createApiResponse(false, "Failed to delete image", null, 500);
  }
}

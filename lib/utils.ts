import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  status: number = 200,
  pagination?: ApiResponse["pagination"]
) {
  const body: ApiResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(pagination && { pagination }),
  };
  return NextResponse.json(body, { status });
}

export function formatDate(date: Date | string | number): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

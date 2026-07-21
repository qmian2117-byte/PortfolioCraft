import { redirect } from "next/navigation";
import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAuthCookie();
  if (!token) {
    redirect("/auth/login");
  }

  const decoded = await verifyJWT(token);
  if (!decoded) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <DashboardNav user={user} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {children}
      </main>
    </div>
  );
}

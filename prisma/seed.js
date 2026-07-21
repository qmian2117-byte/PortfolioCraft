const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database...");

  // Delete existing records
  await prisma.passwordResetToken.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin / Primary Demo User
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "alex@example.com",
      password: hashedPassword,
      role: "ADMIN",
      profile: {
        create: {
          username: "alexrivera",
          title: "Senior Full Stack Software Architect",
          bio: "Passionate software architect with 8+ years building enterprise SaaS, cloud-native backend systems, and responsive web applications.",
          location: "San Francisco, CA",
          phone: "+1 (555) 234-5678",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          resumeUrl: "https://example.com/resume.pdf",
          githubUrl: "https://github.com",
          linkedinUrl: "https://linkedin.com",
          twitterUrl: "https://twitter.com",
          websiteUrl: "https://alexrivera.dev",
          isPublic: true,
        },
      },
      skills: {
        create: [
          { name: "TypeScript & React", category: "FRONTEND", level: 95 },
          { name: "Next.js (App Router)", category: "FRONTEND", level: 92 },
          { name: "Tailwind CSS & shadcn/ui", category: "FRONTEND", level: 90 },
          { name: "Node.js & Express", category: "BACKEND", level: 88 },
          { name: "Prisma & MySQL", category: "DATABASE", level: 85 },
          { name: "Docker & AWS", category: "DEVOPS", level: 80 },
        ],
      },
      projects: {
        create: [
          {
            title: "CloudScale SaaS Analytics Engine",
            description: "High-throughput real-time telemetry analytics platform processing millions of events per minute.",
            content: "Architected using Next.js 15, Prisma ORM, MySQL, Redis cache layer, and WebSocket server for live chart rendering.",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            githubUrl: "https://github.com/example/cloudscale",
            liveUrl: "https://cloudscale-demo.com",
            category: "FULL_STACK",
            technologies: JSON.stringify(["Next.js", "TypeScript", "Prisma", "MySQL", "Tailwind CSS"]),
            isFeatured: true,
          },
          {
            title: "PakAssist AI Suite",
            description: "Intelligent AI assistant platform powered by deep neural models and interactive web interfaces.",
            content: "Features multi-modal generation, real-time web browsing subagent, and interactive user query workflows.",
            imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
            githubUrl: "https://github.com/example/pakassist-ai",
            liveUrl: "https://pakassist-ai.vercel.app",
            category: "WEB_APP",
            technologies: JSON.stringify(["React", "Node.js", "OpenAI API", "Tailwind CSS"]),
            isFeatured: true,
          },
          {
            title: "DevFlow Design System",
            description: "Accessible component library with custom theme engine and glassmorphism UI components.",
            content: "Includes comprehensive documentation, Storybook previews, and NPM package distribution.",
            imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
            githubUrl: "https://github.com/example/devflow-ui",
            liveUrl: "https://devflow-ui.dev",
            category: "UI_UX",
            technologies: JSON.stringify(["TypeScript", "Tailwind CSS", "Framer Motion"]),
            isFeatured: false,
          },
        ],
      },
    },
  });

  console.log("Database Seeded Successfully! Demo user: alex@example.com / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

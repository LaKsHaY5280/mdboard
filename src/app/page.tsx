import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import Link from "next/link";
import { LOGIN, SIGN_UP } from "@/routes";

export default function Home() {
  return (
    <div className="min-h-screen h-full bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-xl font-bold text-foreground">MDboard</h1>
          </div>
          <Link href={LOGIN}>
            <Button variant="outline">Login</Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center min-h-[70vh] flex flex-col justify-center">
            <Badge
              variant="secondary"
              className="mb-6 py-2 px-3 rounded-full mx-auto"
            >
              Management Dashboard
            </Badge>
            <h2 className="text-6xl font-bold text-foreground mb-8">
              Simple Task Management
            </h2>
            <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Organize your tasks, track progress, and manage your workflow with
              a clean, intuitive dashboard designed for productivity.
            </p>
            <div className="flex justify-center">
              <Link href={SIGN_UP}>
                <Button size="lg" className="text-lg px-8 py-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-6 border-t">
        <div className="text-center text-muted-foreground text-sm">
          <p>&copy; 2025 MDboard. Built with Next.js and Prisma.</p>
        </div>
      </footer>
    </div>
  );
}

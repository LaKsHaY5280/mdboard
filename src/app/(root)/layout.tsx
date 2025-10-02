"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN } from "@/routes";
import TopBar from "./_components/TopBar";

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've finished initializing and user is not authenticated
    if (isInitialized && !isAuthenticated) {
      router.replace(LOGIN); // Use replace instead of push to prevent back navigation
    }
  }, [isInitialized, isAuthenticated, router]);

  // Show loading spinner while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main>{children}</main>
    </div>
  );
};

export default Rootlayout;

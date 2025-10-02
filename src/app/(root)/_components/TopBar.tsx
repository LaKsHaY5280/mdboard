"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Target,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { DASHBOARD, PROFILE, NOTES } from "@/routes";

export default function TopBar() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    // Remove leading slash and split path into segments
    const segments = path.replace(/^\//, "").split("/").filter(Boolean);

    if (segments.length === 0) return "Dashboard";

    // Get the main page segment (first segment)
    const mainSegment = segments[0];

    // Capitalize and format the title
    const formatTitle = (segment: string) => {
      return segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    return formatTitle(mainSegment);
  };

  const handleProfileClick = () => {
    router.push(PROFILE);
  };

  const handleDashboardClick = () => {
    router.push(DASHBOARD);
  };

  const handleNotesClick = () => {
    router.push(NOTES);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand/Logo - Left */}
          <button
            onClick={handleDashboardClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity rounded-md p-1"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Target className="size-4" />
            </div>
            <span className="font-bold text-xl text-foreground">MDboard</span>
          </button>

          {/* Page Title - Center */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={pathname === DASHBOARD ? "default" : "ghost"}
              size="sm"
              onClick={handleDashboardClick}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={pathname === NOTES ? "default" : "ghost"}
              size="sm"
              onClick={handleNotesClick}
              className="flex items-center gap-2"
            >
              <StickyNote className="h-4 w-4" />
              Notes
            </Button>
          </div>

          {/* Profile Menu - Right */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span>Welcome,</span>
                <span className="font-medium text-foreground">
                  {user.firstName}
                </span>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                  disabled={isLoading}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm font-semibold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoading ? "Logging out..." : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

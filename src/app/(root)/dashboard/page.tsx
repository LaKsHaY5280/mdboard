"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  StickyNote,
  Plus,
  TrendingUp,
  Clock,
  Users,
  Target,
  Pin,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { NOTES } from "@/routes";

interface Note {
  id: string;
  title: string;
  content?: string;
  category?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalNotes: number;
  pinnedNotes: number;
  categoriesCount: number;
  recentNotes: Note[];
  notesByCategory: { [key: string]: number };
}

export default function DashboardPage() {
  const { user, isInitialized } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/notes");
      const notesData: Note[] = response.data.notes;

      // Calculate stats
      const totalNotes = notesData.length;
      const pinnedNotes = notesData.filter((note) => note.isPinned).length;

      // Group by categories
      const notesByCategory: { [key: string]: number } = {};
      notesData.forEach((note) => {
        const category = note.category || "Uncategorized";
        notesByCategory[category] = (notesByCategory[category] || 0) + 1;
      });

      const categoriesCount = Object.keys(notesByCategory).length;

      // Get recent notes (last 5)
      const recentNotes = notesData
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 5);

      setStats({
        totalNotes,
        pinnedNotes,
        categoriesCount,
        recentNotes,
        notesByCategory,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch data when user is available
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your notes and productivity
            </p>
          </div>

          <Button onClick={() => router.push(NOTES)}>
            <StickyNote className="h-4 w-4 mr-2" />
            Go to Notes
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Notes
                </CardTitle>
                <StickyNote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNotes}</div>
                <p className="text-xs text-muted-foreground">All your notes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pinned Notes
                </CardTitle>
                <Pin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pinnedNotes}</div>
                <p className="text-xs text-muted-foreground">Important notes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.categoriesCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Organization groups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNotes}</div>
                <p className="text-xs text-muted-foreground">Ready to edit</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories and Recent Notes */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Notes by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(stats.notesByCategory).map(
                    ([category, count]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentNotes.length > 0 ? (
                    stats.recentNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => router.push(NOTES)}
                      >
                        <div className="mt-1">
                          {note.isPinned ? (
                            <Pin className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <StickyNote className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {note.title}
                          </p>
                          {note.content && (
                            <p className="text-xs text-muted-foreground truncate">
                              {note.content.substring(0, 50)}...
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(note.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No notes yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => router.push(NOTES)} variant="outline">
                <StickyNote className="h-4 w-4 mr-2" />
                Manage Notes
              </Button>
              <Button onClick={() => router.push("/profile")} variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {stats && stats.totalNotes === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Welcome to MDboard!
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first note to start organizing your thoughts and
                ideas
              </p>
              <Button onClick={() => router.push(NOTES)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

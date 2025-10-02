"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Flag,
  Pin,
  Archive,
  Clock,
  Share2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { format as formatDate } from "date-fns";

interface Note {
  id: string;
  title: string;
  content?: string;
  category?: string;
  tags: string[];
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  isPinned: boolean;
  isArchived?: boolean;
  workspace?: string;
  createdAt: string;
  updatedAt: string;
}

const priorities = [
  { label: "Low", value: "low", color: "text-gray-500" },
  { label: "Medium", value: "medium", color: "text-blue-500" },
  { label: "High", value: "high", color: "text-orange-500" },
  { label: "Urgent", value: "urgent", color: "text-red-500" },
];

const categoryColors: Record<string, string> = {
  personal: "bg-blue-100 text-blue-800 border-blue-200",
  work: "bg-green-100 text-green-800 border-green-200",
  projects: "bg-purple-100 text-purple-800 border-purple-200",
  ideas: "bg-yellow-100 text-yellow-800 border-yellow-200",
  notes: "bg-gray-100 text-gray-800 border-gray-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
  meeting: "bg-indigo-100 text-indigo-800 border-indigo-200",
  tasks: "bg-orange-100 text-orange-800 border-orange-200",
};

export default function NoteViewPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-800 border-gray-200";
    return (
      categoryColors[category.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getPriorityInfo = (priority?: string) => {
    return priorities.find((p) => p.value === priority) || null;
  };

  const copyNoteLink = async () => {
    try {
      const noteUrl = `${window.location.origin}/notes/${note?.id}`;
      await navigator.clipboard.writeText(noteUrl);
      toast.success("Note link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy note link");
    }
  };

  const copyNoteContent = async () => {
    if (!note) return;
    try {
      const shareableContent = `**${note.title}**\n\n${
        note.content || ""
      }\n\n*Shared from Notes App*`;
      await navigator.clipboard.writeText(shareableContent);
      toast.success("Note content copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy note content");
    }
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/notes/${params.id}`);
        setNote(response.data.note);
      } catch (error: any) {
        console.error("Error fetching note:", error);
        if (error.response?.status === 404) {
          setError("Note not found");
        } else if (error.response?.status === 401) {
          setError("You don't have permission to view this note");
        } else {
          setError("Failed to load note");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchNote();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            {error || "Note not found"}
          </h1>
          <Button onClick={() => router.push("/notes")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/notes")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyNoteLink}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyNoteContent}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Content
            </Button>
          </div>
        </div>

        {/* Note Content */}
        <Card className="w-full">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Created {formatDate(new Date(note.createdAt), "PPP")}
                    </span>
                  </div>
                  {note.updatedAt !== note.createdAt && (
                    <div className="flex items-center gap-1">
                      <span>•</span>
                      <span>
                        Updated {formatDate(new Date(note.updatedAt), "PPP")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {note.isPinned && (
                  <Badge variant="secondary" className="gap-1">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </Badge>
                )}
                {note.isArchived && (
                  <Badge variant="outline" className="gap-1">
                    <Archive className="h-3 w-3" />
                    Archived
                  </Badge>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4">
              {note.category && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Category:</span>
                  <Badge
                    variant="outline"
                    className={getCategoryColor(note.category)}
                  >
                    {note.category}
                  </Badge>
                </div>
              )}

              {note.priority && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Priority:</span>
                  <Badge variant="outline" className="gap-1">
                    <Flag
                      className={`h-3 w-3 ${
                        getPriorityInfo(note.priority)?.color
                      }`}
                    />
                    {getPriorityInfo(note.priority)?.label}
                  </Badge>
                </div>
              )}

              {note.dueDate && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Due Date:</span>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(new Date(note.dueDate), "PPP")}
                  </Badge>
                </div>
              )}

              {note.workspace && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Workspace:</span>
                  <Badge variant="outline">{note.workspace}</Badge>
                </div>
              )}
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium">Tags:</span>
                {note.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {note.content ? (
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-base leading-relaxed">
                  {note.content}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No content available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

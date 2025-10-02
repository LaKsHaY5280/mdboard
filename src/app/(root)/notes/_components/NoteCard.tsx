"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreHorizontal,
  Edit,
  Pin,
  PinOff,
  Archive,
  Share2,
  Download,
  Trash2,
  Clock,
  Flag,
} from "lucide-react";
import { format as formatDate } from "date-fns";
import { type Note } from "@/hooks/useNotes";

const priorities = [
  { label: "Low", value: "low", color: "text-gray-500" },
  { label: "Medium", value: "medium", color: "text-blue-500" },
  { label: "High", value: "high", color: "text-orange-500" },
  { label: "Urgent", value: "urgent", color: "text-red-500" },
];

interface NoteCardProps {
  note: Note;
  index: number;
  viewMode: "grid" | "list";
  selectedNotes: string[];
  updateSelectedNotes: (updater: (prev: string[]) => string[]) => void;
  showQuickActions: string | null;
  setShowQuickActions: (noteId: string | null) => void;
  draggedNote: string | null;
  dragOverNote: string | null;
  handleDragStart: (noteId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, noteId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetNoteId: string) => Promise<void>;
  handleOpenEditModal: (note: Note) => void;
  handleTogglePin: (note: Note) => Promise<void>;
  handleToggleArchive: (note: Note) => Promise<void>;
  handleDeleteNote: (noteId: string) => Promise<void>;
  shareNote: (note: Note) => Promise<void>;
  exportNote: (note: Note, format: "json" | "markdown" | "pdf") => void;
}

export function NoteCard({
  note,
  index,
  viewMode,
  selectedNotes,
  updateSelectedNotes,
  showQuickActions,
  setShowQuickActions,
  draggedNote,
  dragOverNote,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleOpenEditModal,
  handleTogglePin,
  handleToggleArchive,
  handleDeleteNote,
  shareNote,
  exportNote,
}: NoteCardProps) {
  const priorityConfig = priorities.find((p) => p.value === note.priority);

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative
        ${note.isPinned ? "ring-2 ring-primary/20 bg-accent/30" : ""}
        ${
          selectedNotes.includes(note.id)
            ? "ring-2 ring-blue-500 bg-blue-50/50"
            : ""
        }
        ${draggedNote === note.id ? "opacity-50 scale-95 rotate-2" : ""}
        ${dragOverNote === note.id ? "ring-2 ring-blue-400/50 scale-105" : ""}
        ${viewMode === "list" ? "flex flex-row" : "flex flex-col"}
        animate-in slide-in-from-bottom-4`}
      style={{ animationDelay: `${index * 50}ms` }}
      draggable
      onDragStart={() => handleDragStart(note.id)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => handleDragOver(e, note.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, note.id)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <input
          type="checkbox"
          checked={selectedNotes.includes(note.id)}
          onChange={(e) => {
            if (e.target.checked) {
              updateSelectedNotes((prev) => [...prev, note.id]);
            } else {
              updateSelectedNotes((prev) =>
                prev.filter((id) => id !== note.id)
              );
            }
          }}
          className="w-4 h-4 rounded border-2"
        />
      </div>

      {/* Quick Actions Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Popover
          open={showQuickActions === note.id}
          onOpenChange={(open) => setShowQuickActions(open ? note.id : null)}
        >
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenEditModal(note)}
                className="w-full justify-start gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTogglePin(note)}
                className="w-full justify-start gap-2"
              >
                {note.isPinned ? (
                  <>
                    <PinOff className="h-4 w-4" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4" />
                    Pin
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleArchive(note)}
                className="w-full justify-start gap-2"
              >
                <Archive className="h-4 w-4" />
                {note.isArchived ? "Unarchive" : "Archive"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareNote(note)}
                className="w-full justify-start gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportNote(note, "markdown")}
                className="w-full justify-start gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <CardHeader
        className={`pb-3 pt-6 ${
          viewMode === "list" ? "flex-shrink-0 w-1/3" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <CardTitle
            className={`line-clamp-2 group-hover:text-primary transition-colors ${
              viewMode === "list" ? "text-base" : "text-lg"
            }`}
          >
            {note.title}
            {note.isPinned && (
              <Pin className="inline h-4 w-4 ml-2 text-primary" />
            )}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent
        className={`space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}
      >
        {note.content && (
          <p
            className={`text-muted-foreground ${
              viewMode === "list"
                ? "text-sm line-clamp-2"
                : "text-sm line-clamp-3"
            }`}
          >
            {note.content}
          </p>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags
              .slice(0, viewMode === "list" ? 2 : 4)
              .map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
            {note.tags.length > (viewMode === "list" ? 2 : 4) && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{note.tags.length - (viewMode === "list" ? 2 : 4)}
              </Badge>
            )}
          </div>
        )}

        {/* Priority and Due Date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {priorityConfig && (
              <div className="flex items-center gap-1">
                <Flag className={`h-3 w-3 ${priorityConfig.color}`} />
                <span className={priorityConfig.color}>
                  {priorityConfig.label}
                </span>
              </div>
            )}
            {note.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Due {formatDate(new Date(note.dueDate), "MMM d")}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(new Date(note.updatedAt), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{note.workspace || "Personal"}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenEditModal(note)}
              className="h-7 w-7 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTogglePin(note)}
              className="h-7 w-7 p-0"
            >
              {note.isPinned ? (
                <PinOff className="h-3 w-3" />
              ) : (
                <Pin className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => shareNote(note)}
              className="h-7 w-7 p-0"
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

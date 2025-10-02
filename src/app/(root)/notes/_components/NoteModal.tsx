"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  AlignLeft,
  Tag,
  Flag,
  Calendar,
  Pin,
  FolderOpen,
  X,
} from "lucide-react";
import { format as formatDate } from "date-fns";
import { type Workspace } from "@/hooks/useNotes";

const priorities = [
  { label: "Low", value: "low", color: "text-gray-500" },
  { label: "Medium", value: "medium", color: "text-blue-500" },
  { label: "High", value: "high", color: "text-orange-500" },
  { label: "Urgent", value: "urgent", color: "text-red-500" },
];

interface NoteModalProps {
  isNoteModalOpen: boolean;
  modalMode: "create" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
  tags: string[];
  tagInput: string;
  priority: string | undefined;
  setPriority: (priority: string | undefined) => void;
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;
  workspaces: Workspace[];
  removeTag: (tagToRemove: string) => void;
  handleTagInputKeyPress: (e: React.KeyboardEvent) => void;
  handleTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveNote: () => Promise<void>;
  handleCloseModal: () => void;
}

export function NoteModal({
  isNoteModalOpen,
  modalMode,
  title,
  setTitle,
  content,
  setContent,
  isPinned,
  setIsPinned,
  tags,
  tagInput,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  selectedWorkspace,
  setSelectedWorkspace,
  workspaces,
  removeTag,
  handleTagInputKeyPress,
  handleTagInputChange,
  handleSaveNote,
  handleCloseModal,
}: NoteModalProps) {
  return (
    <Dialog open={isNoteModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {modalMode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Create New Note
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Edit Note
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium flex items-center gap-2"
            >
              <AlignLeft className="h-4 w-4" />
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your note a catchy title..."
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pour your thoughts here..."
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted/30 rounded-md min-h-[2.5rem]">
              {tags.length === 0 ? (
                <span className="text-sm text-muted-foreground italic">
                  No tags added yet
                </span>
              ) : (
                tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              )}
            </div>
            <Input
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyPress={handleTagInputKeyPress}
              placeholder="Type and press space to add tags..."
              className="text-sm"
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priority
              </label>
              <Select
                value={priority || "none"}
                onValueChange={(value) =>
                  setPriority(value === "none" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Priority</SelectItem>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <span className={p.color}>{p.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      formatDate(dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Workspace
              </label>
              <Select
                value={selectedWorkspace}
                onValueChange={setSelectedWorkspace}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full bg-${workspace.color}-500`}
                        />
                        {workspace.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded"
                />
                <Pin className="h-4 w-4" />
                <span className="text-sm font-medium">Pin this note</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveNote}
            disabled={!title.trim()}
            className="gap-2"
          >
            {modalMode === "create" ? (
              <>
                <Plus className="h-4 w-4" />
                Create Note
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Update Note
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

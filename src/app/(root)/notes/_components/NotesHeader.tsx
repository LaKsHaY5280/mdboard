"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  Archive,
  Zap,
  Plus,
  FolderOpen,
  FolderPlus,
} from "lucide-react";
import { type Workspace } from "@/hooks/useNotes";

interface NotesHeaderProps {
  notes: { id: string }[]; // Array of notes to count
  currentWorkspace: string;
  setCurrentWorkspace: (workspace: string) => void;
  workspaces: Workspace[];
  addNewWorkspace: () => void;
  isArchiveView: boolean;
  setIsArchiveView: (view: boolean) => void;
  setIsQuickCreateOpen: (open: boolean) => void;
  handleOpenCreateModal: () => void;
}

export function NotesHeader({
  notes,
  currentWorkspace,
  setCurrentWorkspace,
  workspaces,
  addNewWorkspace,
  isArchiveView,
  setIsArchiveView,
  setIsQuickCreateOpen,
  handleOpenCreateModal,
}: NotesHeaderProps) {
  const notesCount = notes.length;
  const handleWorkspaceChange = (value: string) => {
    if (value === "new") {
      addNewWorkspace();
    } else {
      setCurrentWorkspace(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
        </div>
        <p className="text-muted-foreground">
          Your thoughts, organized • {notesCount}{" "}
          {notesCount === 1 ? "note" : "notes"} total
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Command className="h-3 w-3" />
          <span>Press ⌘K to search, ⌘N for new note</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Workspace Selector */}
        <Select value={currentWorkspace} onValueChange={handleWorkspaceChange}>
          <SelectTrigger className="w-40">
            <SelectValue>
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                {workspaces.find((w) => w.id === currentWorkspace)?.name ||
                  "Personal"}
              </div>
            </SelectValue>
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
            <SelectItem value="new">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" />
                New Workspace
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Archive Toggle */}
        <Button
          variant={isArchiveView ? "default" : "outline"}
          size="sm"
          onClick={() => setIsArchiveView(!isArchiveView)}
          className="gap-2"
        >
          <Archive className="h-4 w-4" />
          {isArchiveView ? "View Active" : "View Archive"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsQuickCreateOpen(true)}
          className="gap-2"
        >
          <Zap className="h-4 w-4" />
          Quick Note
        </Button>
        <Button onClick={handleOpenCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { NotesHeader } from "./_components/NotesHeader";
import { NotesFilters } from "./_components/NotesFilters";
import { NotesGrid } from "./_components/NotesGrid";
import { EmptyState } from "./_components/EmptyState";
import { QuickCreateModal } from "./_components/QuickCreateModal";
import { NoteModal } from "./_components/NoteModal";
import { ShareModal } from "./_components/ShareModal";

export default function NotesPage() {
  const { isInitialized } = useAuth();
  const notesHook = useNotes();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      // Cmd/Ctrl + N for new note
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        notesHook.handleOpenCreateModal();
      }
      // Cmd/Ctrl + Shift + Q for quick create
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Q") {
        e.preventDefault();
        notesHook.setIsQuickCreateOpen(true);
      }
      // Escape to close modals
      if (e.key === "Escape") {
        notesHook.setIsQuickCreateOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notesHook.handleOpenCreateModal, notesHook.setIsQuickCreateOpen]);

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

  if (notesHook.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <NotesHeader {...notesHook} />
        <NotesFilters {...notesHook} />

        {notesHook.filteredNotes.length > 0 ? (
          <NotesGrid {...notesHook} />
        ) : (
          <EmptyState {...notesHook} />
        )}

        <QuickCreateModal {...notesHook} />
        <NoteModal {...notesHook} />
        <ShareModal {...notesHook} />
      </div>
    </div>
  );
}

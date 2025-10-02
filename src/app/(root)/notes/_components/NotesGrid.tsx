"use client";

import { NoteCard } from "./NoteCard";
import { type Note } from "@/hooks/useNotes";

interface NotesGridProps {
  filteredNotes: Note[];
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

export function NotesGrid({
  filteredNotes,
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
}: NotesGridProps) {
  return (
    <div
      className={`grid gap-4 transition-all duration-300 ${
        viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {filteredNotes.map((note, index) => (
        <NoteCard
          key={note.id}
          note={note}
          index={index}
          viewMode={viewMode}
          selectedNotes={selectedNotes}
          updateSelectedNotes={updateSelectedNotes}
          showQuickActions={showQuickActions}
          setShowQuickActions={setShowQuickActions}
          draggedNote={draggedNote}
          dragOverNote={dragOverNote}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleOpenEditModal={handleOpenEditModal}
          handleTogglePin={handleTogglePin}
          handleToggleArchive={handleToggleArchive}
          handleDeleteNote={handleDeleteNote}
          shareNote={shareNote}
          exportNote={exportNote}
        />
      ))}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StickyNote, Plus, Zap } from "lucide-react";

interface EmptyStateProps {
  notes: { id: string }[];
  handleOpenCreateModal: () => void;
  setIsQuickCreateOpen: (open: boolean) => void;
}

export function EmptyState({
  notes,
  handleOpenCreateModal,
  setIsQuickCreateOpen,
}: EmptyStateProps) {
  const notesCount = notes.length;
  return (
    <Card className="text-center py-16 bg-muted/20 border-dashed">
      <CardContent>
        <div className="relative">
          <StickyNote className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-3">
          {notesCount === 0
            ? "Your creative space awaits"
            : "No notes match your search"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {notesCount === 0
            ? "Start capturing your brilliant ideas, thoughts, and reminders. Your notes are about to become your second brain."
            : "Try adjusting your search terms or filters to find what you're looking for."}
        </p>
        {notesCount === 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={handleOpenCreateModal} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Note
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsQuickCreateOpen(true)}
              size="lg"
              className="gap-2"
            >
              <Zap className="h-5 w-5" />
              Quick Note
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy, Link, Mail, Download, FileText } from "lucide-react";
import { type Note } from "@/hooks/useNotes";

interface ShareModalProps {
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareableNote: Note | null;
  copyNoteContent: (note: Note) => Promise<void>;
  copyNoteLink: (note: Note) => Promise<void>;
  shareToEmail: (note: Note) => void;
  exportNote: (note: Note, format: "json" | "markdown" | "pdf") => void;
}

export function ShareModal({
  isShareModalOpen,
  setIsShareModalOpen,
  shareableNote,
  copyNoteContent,
  copyNoteLink,
  shareToEmail,
  exportNote,
}: ShareModalProps) {
  if (!shareableNote) return null;

  return (
    <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Share "{shareableNote.title}" with others
          </div>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => copyNoteContent(shareableNote)}
              className="w-full justify-start gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Note Content
            </Button>
            <Button
              variant="outline"
              onClick={() => copyNoteLink(shareableNote)}
              className="w-full justify-start gap-2"
            >
              <Link className="h-4 w-4" />
              Copy Note Link
            </Button>
            <Button
              variant="outline"
              onClick={() => shareToEmail(shareableNote)}
              className="w-full justify-start gap-2"
            >
              <Mail className="h-4 w-4" />
              Share via Email
            </Button>
            <Button
              variant="outline"
              onClick={() => exportNote(shareableNote, "markdown")}
              className="w-full justify-start gap-2"
            >
              <Download className="h-4 w-4" />
              Download as Markdown
            </Button>
            <Button
              variant="outline"
              onClick={() => exportNote(shareableNote, "json")}
              className="w-full justify-start gap-2"
            >
              <FileText className="h-4 w-4" />
              Download as JSON
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsShareModalOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

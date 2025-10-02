"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Zap, Plus } from "lucide-react";

interface QuickCreateModalProps {
  isQuickCreateOpen: boolean;
  quickTitle: string;
  setQuickTitle: (title: string) => void;
  handleQuickCreate: () => Promise<void>;
  setIsQuickCreateOpen: (open: boolean) => void;
}

export function QuickCreateModal({
  isQuickCreateOpen,
  quickTitle,
  setQuickTitle,
  handleQuickCreate,
  setIsQuickCreateOpen,
}: QuickCreateModalProps) {
  if (!isQuickCreateOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="What's on your mind?"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleQuickCreate();
              if (e.key === "Escape") setIsQuickCreateOpen(false);
            }}
            autoFocus
            className="text-base"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsQuickCreateOpen(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuickCreate}
              disabled={!quickTitle.trim()}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

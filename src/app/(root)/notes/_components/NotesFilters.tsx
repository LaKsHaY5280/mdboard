"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  CalendarDays,
  Tag,
  ArrowUpDown,
  Grid3X3,
  List,
  Download,
  Archive,
  Trash2,
  X,
  Pin,
  Flag,
  Calendar,
} from "lucide-react";
import { type Note } from "@/hooks/useNotes";

interface NotesFiltersProps {
  // Data
  notes: Note[];

  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Date Range
  dateRange: { start?: Date; end?: Date };
  updateDateRange: (updates: Partial<{ start?: Date; end?: Date }>) => void;
  setDateRange: (range: { start?: Date; end?: Date }) => void;

  // Tags
  selectedTags: string[];
  updateSelectedTags: (updater: (prev: string[]) => string[]) => void;
  setSelectedTags: (tags: string[]) => void;

  // View and Sort
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "updated" | "created" | "title" | "priority";
  setSortBy: (sort: "updated" | "created" | "title" | "priority") => void;

  // Selection and Bulk Operations
  selectedNotes: string[];
  setSelectedNotes: (notes: string[]) => void;
  bulkExport: (format: "json" | "markdown") => void;
  bulkArchive: () => Promise<void>;
  bulkDelete: () => Promise<void>;
}

export function NotesFilters({
  notes,
  searchTerm,
  setSearchTerm,
  dateRange,
  updateDateRange,
  setDateRange,
  selectedTags,
  updateSelectedTags,
  setSelectedTags,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  selectedNotes,
  setSelectedNotes,
  bulkExport,
  bulkArchive,
  bulkDelete,
}: NotesFiltersProps) {
  // Compute all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)));
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-input"
            placeholder="Search notes... (⌘K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm"
          />
        </div>

        {/* Advanced Search Controls */}
        <div className="flex items-center gap-2">
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={
                  dateRange.start || dateRange.end ? "default" : "outline"
                }
                size="sm"
                className="gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.start}
                    onSelect={(date) => updateDateRange({ start: date })}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.end}
                    onSelect={(date) => updateDateRange({ end: date })}
                    className="rounded-md border"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange({})}
                  className="w-full"
                >
                  Clear Date Range
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Tag Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={selectedTags.length > 0 ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <Tag className="h-4 w-4" />
                Tags ({selectedTags.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Filter by Tags</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateSelectedTags((prev) => [...prev, tag]);
                          } else {
                            updateSelectedTags((prev) =>
                              prev.filter((t) => t !== tag)
                            );
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="w-full"
                >
                  Clear All Tags
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Export */}
          {selectedNotes.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export ({selectedNotes.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => bulkExport("json")}
                    className="w-full justify-start gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => bulkExport("markdown")}
                    className="w-full justify-start gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export as Markdown
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "updated" | "created" | "title" | "priority")
            }
          >
            <SelectTrigger className="w-40">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Operations */}
      {selectedNotes.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedNotes.length} note
              {selectedNotes.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedNotes([])}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={bulkArchive}
              className="gap-2"
            >
              <Archive className="h-4 w-4" />
              Archive
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => bulkExport("json")}
                    className="w-full justify-start"
                  >
                    JSON
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => bulkExport("markdown")}
                    className="w-full justify-start"
                  >
                    Markdown
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="destructive"
              size="sm"
              onClick={bulkDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {notes.length > 0 && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Pin className="h-3 w-3" />
            <span>{notes.filter((n) => n.isPinned).length} pinned</span>
          </div>
          <div className="flex items-center gap-1">
            <Flag className="h-3 w-3" />
            <span>{notes.filter((n) => n.priority).length} with priority</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{notes.filter((n) => n.dueDate).length} with due dates</span>
          </div>
        </div>
      )}
    </div>
  );
}

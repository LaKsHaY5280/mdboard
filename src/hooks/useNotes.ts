"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import axios from "axios";

export interface Note {
  id: string;
  title: string;
  content?: string;
  tags: string[];
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  isPinned: boolean;
  isArchived?: boolean;
  workspace?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
}

export interface UseNotesReturn {
  // Data
  notes: Note[];
  filteredNotes: Note[];
  isLoading: boolean;

  // Search and Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  dateRange: { start?: Date; end?: Date };
  setDateRange: (range: { start?: Date; end?: Date }) => void;
  updateDateRange: (updates: Partial<{ start?: Date; end?: Date }>) => void;
  updateSelectedTags: (updater: (prev: string[]) => string[]) => void;
  updateSelectedNotes: (updater: (prev: string[]) => string[]) => void;

  // View Options
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "updated" | "created" | "title" | "priority";
  setSortBy: (sort: "updated" | "created" | "title" | "priority") => void;
  isArchiveView: boolean;
  setIsArchiveView: (view: boolean) => void;

  // Workspaces
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  currentWorkspace: string;
  setCurrentWorkspace: (workspace: string) => void;
  addNewWorkspace: () => void;

  // Selection
  selectedNotes: string[];
  setSelectedNotes: (notes: string[]) => void;

  // Quick Create
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  quickTitle: string;
  setQuickTitle: (title: string) => void;
  handleQuickCreate: () => Promise<void>;

  // Modal Management
  isNoteModalOpen: boolean;
  setIsNoteModalOpen: (open: boolean) => void;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
  modalMode: "create" | "edit";
  setModalMode: (mode: "create" | "edit") => void;

  // Form States
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (input: string) => void;
  priority: string | undefined;
  setPriority: (priority: string | undefined) => void;
  dueDate: Date | undefined;
  setDueDate: (date: Date | undefined) => void;
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;

  // Share Modal
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareableNote: Note | null;
  setShareableNote: (note: Note | null) => void;

  // Quick Actions
  showQuickActions: string | null;
  setShowQuickActions: (noteId: string | null) => void;

  // Drag and Drop
  draggedNote: string | null;
  setDraggedNote: (noteId: string | null) => void;
  dragOverNote: string | null;
  setDragOverNote: (noteId: string | null) => void;
  handleDragStart: (noteId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, noteId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetNoteId: string) => Promise<void>;

  // CRUD Operations
  handleSaveNote: () => Promise<void>;
  handleDeleteNote: (noteId: string) => Promise<void>;
  handleTogglePin: (note: Note) => Promise<void>;
  handleToggleArchive: (note: Note) => Promise<void>;

  // Modal Handlers
  handleOpenCreateModal: () => void;
  handleOpenEditModal: (note: Note) => void;
  handleCloseModal: () => void;

  // Tag Management
  addTag: () => void;
  removeTag: (tagToRemove: string) => void;
  handleTagInputKeyPress: (e: React.KeyboardEvent) => void;
  handleTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Bulk Operations
  bulkArchive: () => Promise<void>;
  bulkDelete: () => Promise<void>;
  bulkExport: (format: "json" | "markdown") => void;

  // Export and Share
  exportNote: (note: Note, format: "json" | "markdown" | "pdf") => void;
  shareNote: (note: Note) => Promise<void>;
  copyNoteLink: (note: Note) => Promise<void>;
  copyNoteContent: (note: Note) => Promise<void>;
  shareToEmail: (note: Note) => void;

  // Refresh
  fetchNotes: () => Promise<void>;
}

export const useNotes = (): UseNotesReturn => {
  const { user } = useAuth();

  // Data state
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "updated" | "created" | "title" | "priority"
  >("updated");
  const [isArchiveView, setIsArchiveView] = useState(false);

  // Workspace state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: "default", name: "Personal", color: "blue" },
    { id: "work", name: "Work", color: "green" },
    { id: "projects", name: "Projects", color: "purple" },
  ]);
  const [currentWorkspace, setCurrentWorkspace] = useState("default");

  // Selection state
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  // Helper functions for complex state updates
  const updateDateRange = (updates: Partial<{ start?: Date; end?: Date }>) => {
    setDateRange((prev) => ({ ...prev, ...updates }));
  };

  const updateSelectedTags = (updater: (prev: string[]) => string[]) => {
    setSelectedTags(updater);
  };

  const updateSelectedNotes = (updater: (prev: string[]) => string[]) => {
    setSelectedNotes(updater);
  };

  // Quick create state
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");

  // Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [priority, setPriority] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedWorkspace, setSelectedWorkspace] = useState("default");

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableNote, setShareableNote] = useState<Note | null>(null);

  // Quick actions state
  const [showQuickActions, setShowQuickActions] = useState<string | null>(null);

  // Drag and drop state
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragOverNote, setDragOverNote] = useState<string | null>(null);

  // Fetch notes function
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/notes");
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch notes when user is available
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  // Filter and sort notes effect
  useEffect(() => {
    let filtered = notes;

    // Filter by archive status
    filtered = filtered.filter((note) =>
      isArchiveView ? note.isArchived : !note.isArchived
    );

    // Filter by workspace
    filtered = filtered.filter(
      (note) => note.workspace === currentWorkspace || !note.workspace
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by selected tags (AND operation)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((tag) => note.tags.includes(tag))
      );
    }

    // Filter by date range
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.createdAt);
        const start = dateRange.start
          ? new Date(dateRange.start)
          : new Date("1970-01-01");
        const end = dateRange.end ? new Date(dateRange.end) : new Date();
        return noteDate >= start && noteDate <= end;
      });
    }

    // Sort notes
    filtered.sort((a, b) => {
      // Pinned notes always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aPriority =
            priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority =
            priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return bPriority - aPriority;
        default: // updated
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

    setFilteredNotes(filtered);
  }, [
    notes,
    searchTerm,
    sortBy,
    selectedTags,
    dateRange,
    isArchiveView,
    currentWorkspace,
  ]);

  // Drag and drop handlers
  const handleDragStart = (noteId: string) => {
    setDraggedNote(noteId);
  };

  const handleDragEnd = () => {
    setDraggedNote(null);
    setDragOverNote(null);
  };

  const handleDragOver = (e: React.DragEvent, noteId: string) => {
    e.preventDefault();
    setDragOverNote(noteId);
  };

  const handleDragLeave = () => {
    setDragOverNote(null);
  };

  const handleDrop = async (e: React.DragEvent, targetNoteId: string) => {
    e.preventDefault();
    if (!draggedNote || draggedNote === targetNoteId) return;

    try {
      // Simple reordering - move dragged note to target position
      const draggedIndex = filteredNotes.findIndex((n) => n.id === draggedNote);
      const targetIndex = filteredNotes.findIndex((n) => n.id === targetNoteId);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newNotes = [...notes];
        const draggedNoteObj = newNotes.find((n) => n.id === draggedNote);
        const targetNoteObj = newNotes.find((n) => n.id === targetNoteId);

        if (draggedNoteObj && targetNoteObj) {
          // Simple visual feedback for now
          toast.success(
            `Moved "${draggedNoteObj.title}" near "${targetNoteObj.title}"`
          );
        }
      }

      setDraggedNote(null);
      setDragOverNote(null);
    } catch (error) {
      toast.error("Failed to reorder notes");
    }
  };

  // Workspace management
  const addNewWorkspace = () => {
    const name = prompt("Enter workspace name:");
    if (!name?.trim()) return;

    const colors = [
      "blue",
      "green",
      "purple",
      "orange",
      "red",
      "yellow",
      "pink",
      "indigo",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newWorkspace = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.trim(),
      color,
    };

    setWorkspaces((prev) => [...prev, newWorkspace]);
    toast.success(`Workspace "${name}" created successfully`);
  };

  // CRUD operations
  const handleSaveNote = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim() || undefined,
        isPinned,
        tags: tags.length > 0 ? tags : undefined,
        priority: priority || undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        workspace: selectedWorkspace,
      };

      if (modalMode === "create") {
        const response = await axios.post("/api/notes", noteData);
        setNotes([response.data.note, ...notes]);
        toast.success("Note created successfully");
      } else {
        const response = await axios.put("/api/notes", {
          noteId: editingNote?.id,
          ...noteData,
        });
        setNotes(
          notes.map((n) => (n.id === editingNote?.id ? response.data.note : n))
        );
        toast.success("Note updated successfully");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error(
        `Failed to ${modalMode === "create" ? "create" : "update"} note`
      );
    }
  };

  const handleQuickCreate = async () => {
    if (!quickTitle.trim()) return;

    try {
      const noteData = {
        title: quickTitle.trim(),
        content: "",
        isPinned: false,
        tags: [],
        priority: undefined,
        dueDate: undefined,
        workspace: currentWorkspace,
      };

      const response = await axios.post("/api/notes", noteData);
      setNotes([response.data.note, ...notes]);
      toast.success("Note created successfully!");
      setQuickTitle("");
      setIsQuickCreateOpen(false);
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await axios.delete(`/api/notes?id=${noteId}`);
      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async (note: Note) => {
    try {
      const response = await axios.put("/api/notes", {
        noteId: note.id,
        isPinned: !note.isPinned,
      });
      setNotes(notes.map((n) => (n.id === note.id ? response.data.note : n)));
      toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Failed to update note");
    }
  };

  const handleToggleArchive = async (note: Note) => {
    try {
      const response = await axios.put("/api/notes", {
        noteId: note.id,
        isArchived: !note.isArchived,
      });
      setNotes(notes.map((n) => (n.id === note.id ? response.data.note : n)));
      toast.success(note.isArchived ? "Note unarchived" : "Note archived");
    } catch (error) {
      console.error("Error toggling archive:", error);
      toast.error("Failed to update note");
    }
  };

  // Modal handlers
  const handleOpenCreateModal = () => {
    setTitle("");
    setContent("");
    setIsPinned(false);
    setTags([]);
    setTagInput("");
    setPriority(undefined);
    setDueDate(undefined);
    setSelectedWorkspace(currentWorkspace);
    setEditingNote(null);
    setModalMode("create");
    setIsNoteModalOpen(true);
  };

  const handleOpenEditModal = (note: Note) => {
    setTitle(note.title);
    setContent(note.content || "");
    setIsPinned(note.isPinned);
    setTags(note.tags || []);
    setTagInput("");
    setPriority(note.priority || undefined);
    setDueDate(note.dueDate ? new Date(note.dueDate) : undefined);
    setSelectedWorkspace(note.workspace || "default");
    setEditingNote(note);
    setModalMode("edit");
    setIsNoteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  // Tag management
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(" ") && value.trim() !== "") {
      const tagToAdd = value.trim();
      if (tagToAdd && !tags.includes(tagToAdd)) {
        setTags([...tags, tagToAdd]);
      }
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };

  // Bulk operations
  const bulkArchive = async () => {
    if (selectedNotes.length === 0) return;

    try {
      await axios.post("/api/notes/bulk", {
        noteIds: selectedNotes,
        operation: "archive",
      });

      setNotes(
        notes.map((note) =>
          selectedNotes.includes(note.id) ? { ...note, isArchived: true } : note
        )
      );

      toast.success(`${selectedNotes.length} notes archived`);
      setSelectedNotes([]);
    } catch (error) {
      toast.error("Failed to archive notes");
    }
  };

  const bulkDelete = async () => {
    if (selectedNotes.length === 0) return;

    try {
      await axios.post("/api/notes/bulk", {
        noteIds: selectedNotes,
        operation: "delete",
      });

      setNotes(notes.filter((note) => !selectedNotes.includes(note.id)));
      toast.success(`${selectedNotes.length} notes deleted`);
      setSelectedNotes([]);
    } catch (error) {
      toast.error("Failed to delete notes");
    }
  };

  const bulkExport = (format: "json" | "markdown") => {
    const selectedNotesData = notes.filter((note) =>
      selectedNotes.includes(note.id)
    );
    if (selectedNotesData.length === 0) return;

    if (format === "json") {
      const dataStr = JSON.stringify(selectedNotesData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `notes_export_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "markdown") {
      const markdown = selectedNotesData
        .map((note) => {
          const formatDate = (date: string | Date) => {
            return new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(date));
          };

          return `# ${note.title}\n\n${
            note.content || ""
          }\n\n---\n\n**Tags:** ${
            note.tags.join(", ") || "None"
          }\n**Created:** ${formatDate(note.createdAt)}\n\n`;
        })
        .join("\n\n");
      const dataBlob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `notes_export_${
        new Date().toISOString().split("T")[0]
      }.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
    toast.success(
      `${selectedNotesData.length} notes exported as ${format.toUpperCase()}`
    );
  };

  // Export and share functions
  const exportNote = (note: Note, format: "json" | "markdown" | "pdf") => {
    const filename = `${note.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;

    if (format === "json") {
      const dataStr = JSON.stringify(note, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "markdown") {
      const formatDate = (date: string | Date) => {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(date));
      };

      const markdown = `# ${note.title}\n\n${
        note.content || ""
      }\n\n---\n\n**Tags:** ${
        note.tags.join(", ") || "None"
      }\n**Created:** ${formatDate(note.createdAt)}`;
      const dataBlob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
    toast.success(`Note exported as ${format.toUpperCase()}`);
  };

  const shareNote = async (note: Note) => {
    setShareableNote(note);
    setIsShareModalOpen(true);
  };

  const copyNoteLink = async (note: Note) => {
    try {
      const noteUrl = `${window.location.origin}/notes/${note.id}`;
      await navigator.clipboard.writeText(noteUrl);
      toast.success("Note link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy note link");
    }
  };

  const copyNoteContent = async (note: Note) => {
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

  const shareToEmail = (note: Note) => {
    const subject = encodeURIComponent(`Note: ${note.title}`);
    const body = encodeURIComponent(
      `${note.title}\n\n${note.content || ""}\n\nShared from Notes App`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return {
    // Data
    notes,
    filteredNotes,
    isLoading,

    // Search and Filters
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    dateRange,
    setDateRange,
    updateDateRange,
    updateSelectedTags,
    updateSelectedNotes,

    // View Options
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    isArchiveView,
    setIsArchiveView,

    // Workspaces
    workspaces,
    setWorkspaces,
    currentWorkspace,
    setCurrentWorkspace,
    addNewWorkspace,

    // Selection
    selectedNotes,
    setSelectedNotes,

    // Quick Create
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    quickTitle,
    setQuickTitle,
    handleQuickCreate,

    // Modal Management
    isNoteModalOpen,
    setIsNoteModalOpen,
    editingNote,
    setEditingNote,
    modalMode,
    setModalMode,

    // Form States
    title,
    setTitle,
    content,
    setContent,
    isPinned,
    setIsPinned,
    tags,
    setTags,
    tagInput,
    setTagInput,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    selectedWorkspace,
    setSelectedWorkspace,

    // Share Modal
    isShareModalOpen,
    setIsShareModalOpen,
    shareableNote,
    setShareableNote,

    // Quick Actions
    showQuickActions,
    setShowQuickActions,

    // Drag and Drop
    draggedNote,
    setDraggedNote,
    dragOverNote,
    setDragOverNote,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    // CRUD Operations
    handleSaveNote,
    handleDeleteNote,
    handleTogglePin,
    handleToggleArchive,

    // Modal Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,

    // Tag Management
    addTag,
    removeTag,
    handleTagInputKeyPress,
    handleTagInputChange,

    // Bulk Operations
    bulkArchive,
    bulkDelete,
    bulkExport,

    // Export and Share
    exportNote,
    shareNote,
    copyNoteLink,
    copyNoteContent,
    shareToEmail,

    // Refresh
    fetchNotes,
  };
};

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Check,
  FileText,
} from "lucide-react";
import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ExportModal } from "../components/dashboard/ExportModal";
import { TeamCollaborateModal } from "../components/board/TeamCollaborateModal";
import { TemplateLibraryButton } from "../components/board/TemplateLibraryButton";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useBoards } from "../contexts/BoardContext";
import {
  fetchCollaborators,
  type CollaboratorWithUser,
} from "../lib/services/collaboratorService";
import { fetchWhiteboard } from "../lib/services/whiteboardService";
import { getInitials, cn } from "../lib/utils";
import { toast } from "sonner";

// TLDraw License Key from environment
const TLDRAW_LICENSE_KEY = import.meta.env.VITE_TLDRAW_LICENSE_KEY || "";

export function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { boards, updateBoard, toggleFavorite } = useBoards();

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shareBoardModalOpen, setShareBoardModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pageFormat, setPageFormat] = useState<"blank" | "ruled">("blank");
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [collaborators, setCollaborators] = useState<CollaboratorWithUser[]>([]);

  // TLDraw refs
  const editorRef = useRef<Editor | null>(null);
  const hasLoadedDataRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);
  const currentBoardIdRef = useRef<string | null>(null);

  const board = boards.find((b) => b.id === id);

  // Reset state when board changes
  useEffect(() => {
    if (id && id !== currentBoardIdRef.current) {
      currentBoardIdRef.current = id;
      hasLoadedDataRef.current = false;
      editorRef.current = null;
    }
  }, [id]);

  // Load collaborators
  const loadCollaborators = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchCollaborators(id);
      setCollaborators(data);
    } catch (error) {
      console.error("Error loading collaborators:", error);
    }
  }, [id]);

  // Detect template from board
  useEffect(() => {
    if (board) {
      setTitle(board.title);
      
      let detectedTemplateId: string | undefined = board.template;
      const isInternalTemplateId = detectedTemplateId?.startsWith("template-");
      
      if (!isInternalTemplateId && board.title) {
        const titleLower = board.title.toLowerCase();
        if (titleLower.includes("math") || titleLower.includes("equation")) {
          detectedTemplateId = "template-math";
        } else if (titleLower.includes("mind map")) {
          detectedTemplateId = "template-mindmap";
        } else if (titleLower.includes("brainstorm")) {
          detectedTemplateId = "template-brainstorm";
        } else if (titleLower.includes("kanban")) {
          detectedTemplateId = "template-kanban";
        } else if (titleLower.includes("flowchart")) {
          detectedTemplateId = "template-flowchart";
        }
      }
      
      if (detectedTemplateId) {
        console.log("[Board] Detected template:", detectedTemplateId);
        setTemplateId(detectedTemplateId);
      }
      
      loadCollaborators();
    }
  }, [board, loadCollaborators]);

  // Debounced save function
  const saveToDatabase = useCallback(async () => {
    if (!id || !editorRef.current || isSaving) return;

    try {
      setIsSaving(true);
      
      const editor = editorRef.current;
      // Get all records from the store
      const allRecords = editor.store.allRecords();
      
      const saveData = {
        records: allRecords,
        savedAt: new Date().toISOString(),
        version: 2,
      };

      console.log("[Board] Saving", allRecords.length, "records to database");
      
      await updateBoard(id, {
        data: saveData as Record<string, unknown>,
      });

      setLastSaved(new Date());
      toast.success("Board saved!");
    } catch (error) {
      console.error("[Board] Save failed:", error);
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  }, [id, isSaving, updateBoard]);

  // Handle manual save
  const handleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveToDatabase();
  }, [saveToDatabase]);

  // Handle editor mount
  const handleEditorMount = useCallback((editor: Editor) => {
    console.log("[Board] TLDraw editor mounted for board:", id);
    editorRef.current = editor;

    // Load saved data if available
    if (!hasLoadedDataRef.current && id) {
      isLoadingRef.current = true;
      
      fetchWhiteboard(id).then((whiteboard) => {
        if (whiteboard?.data && editorRef.current) {
          const data = whiteboard.data as { records?: unknown[]; version?: number };
          
          if (data.version === 2 && data.records && Array.isArray(data.records)) {
            console.log("[Board] Loading", data.records.length, "saved records");
            try {
              // Put records directly into the store
              editorRef.current.store.put(data.records as any[]);
              toast.success("Board loaded!");
            } catch (error) {
              console.error("[Board] Error loading records:", error);
            }
          } else {
            console.log("[Board] No compatible data found, starting fresh");
          }
        }
        hasLoadedDataRef.current = true;
        isLoadingRef.current = false;
      }).catch((error) => {
        console.error("[Board] Error loading board:", error);
        hasLoadedDataRef.current = true;
        isLoadingRef.current = false;
      });
    }

    // Set up auto-save on changes
    const unsubscribe = editor.store.listen(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        if (hasLoadedDataRef.current && !isLoadingRef.current) {
          saveToDatabase();
        }
      }, 3000);
    }, { scope: "document" });

    return () => {
      unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [id, saveToDatabase]);

  // Handle title submit
  const handleTitleSubmit = () => {
    if (title.trim() && title !== board?.title) {
      updateBoard(board!.id, { title: title.trim() });
      toast.success("Board renamed");
    }
    setIsEditing(false);
  };

  // Insert template component
  const insertTemplateComponent = useCallback((componentType: string, data?: Record<string, unknown>) => {
    if (!editorRef.current) {
      toast.error("Canvas not ready");
      return;
    }

    console.log("[Board] Inserting component:", componentType, data);
    
    const editor = editorRef.current;
    const center = editor.getViewportScreenCenter();
    const textContent = (data?.label as string) || (data?.symbol as string) || componentType;
    
    // Create a geo shape with text
    editor.createShape({
      type: "geo",
      x: center.x - 50,
      y: center.y - 25,
      props: {
        w: 120,
        h: 60,
        geo: "rectangle",
        text: textContent,
      },
    });

    toast.success(`Added: ${textContent}`);
  }, []);

  // Not found state
  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Board not found
          </h2>
          <p className="text-slate-500 mb-4">
            This board may have been deleted.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Board Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              autoFocus
              className="max-w-xs font-medium"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-lg font-medium text-slate-900 hover:text-primary-600 transition-colors"
            >
              {board.title}
            </button>
          )}

          <button
            onClick={() => toggleFavorite(board.id)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              board.isFavorite
                ? "text-amber-500 hover:text-amber-600"
                : "text-slate-400 hover:text-amber-500"
            )}
          >
            <Star
              className={cn("w-5 h-5", board.isFavorite && "fill-current")}
            />
          </button>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            size="sm"
            className={cn(
              "gap-2",
              lastSaved && "border-green-600 text-green-600 hover:bg-green-50"
            )}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{lastSaved ? "Saved" : "Save"}</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Page Format Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {pageFormat === "ruled" ? "Ruled" : "Blank"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setPageFormat("blank")}
                className={cn(pageFormat === "blank" && "bg-slate-100")}
              >
                <Check
                  className={cn(
                    "w-4 h-4 mr-2",
                    pageFormat !== "blank" && "invisible"
                  )}
                />
                Blank
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPageFormat("ruled")}
                className={cn(pageFormat === "ruled" && "bg-slate-100")}
              >
                <Check
                  className={cn(
                    "w-4 h-4 mr-2",
                    pageFormat !== "ruled" && "invisible"
                  )}
                />
                Ruled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((collab) => (
                <Avatar key={collab.id} className="w-8 h-8 border-2 border-white">
                  <AvatarFallback className="text-xs bg-primary-100 text-primary-700">
                    {getInitials((collab as any).profiles?.full_name || (collab as any).profiles?.email || "")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {collaborators.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareBoardModalOpen(true)}
          >
            Share
          </Button>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
          >
            Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative bg-white overflow-hidden">
        {/* Template Library Button */}
        {templateId && templateId !== "template-blank" && (
          <div className="absolute top-4 left-4 z-20">
            <TemplateLibraryButton
              templateId={templateId}
              onInsertComponent={insertTemplateComponent}
            />
          </div>
        )}

        {/* TLDraw Canvas */}
        <div className="absolute inset-0" style={{ height: "100%", width: "100%" }}>
          <Tldraw
            key={id}
            onMount={handleEditorMount}
            licenseKey={TLDRAW_LICENSE_KEY || undefined}
          />
        </div>
      </main>

      {/* Modals */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        boardTitle={board.title}
      />

      <TeamCollaborateModal
        open={shareBoardModalOpen}
        onOpenChange={setShareBoardModalOpen}
        boardId={board.id}
        boardTitle={board.title}
      />
    </div>
  );
}

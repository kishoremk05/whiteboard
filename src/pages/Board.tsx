import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share,
  Download,
  MoreHorizontal,
  Star,
  Check,
  FileText,
  UserPlus,
} from "lucide-react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { getInitials } from "../lib/utils";
import { cn } from "../lib/utils";
import { toast } from "sonner";

export function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { boards, updateBoard, toggleFavorite } = useBoards();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shareBoardModalOpen, setShareBoardModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [pageFormat, setPageFormat] = useState<"blank" | "ruled">("blank");
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [collaborators, setCollaborators] = useState<CollaboratorWithUser[]>(
    []
  );
  const [boardData, setBoardData] = useState<unknown>(null); // Directly fetched board data

  // Excalidraw API ref
  const excalidrawAPIRef = useRef<any>(null);

  const board = boards.find((b) => b.id === id);

  const loadCollaborators = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchCollaborators(id);
      setCollaborators(data);
    } catch (error) {
      console.error("Error loading collaborators:", error);
    }
  }, [id]);

  useEffect(() => {
    if (board) {
      setTitle(board.title);

      // Get template ID - either from metadata or infer from title
      let detectedTemplateId: string | undefined = board.template;

      // If template ID is a database UUID (not our internal template-* format),
      // use title-based inference instead
      const isInternalTemplateId = detectedTemplateId?.startsWith("template-");

      if (!isInternalTemplateId && board.title) {
        const titleLower = board.title.toLowerCase();
        // Math-related templates
        if (
          titleLower.includes("calculus") ||
          titleLower.includes("derivative")
        ) {
          detectedTemplateId = "template-calculus";
        } else if (titleLower.includes("quadratic")) {
          detectedTemplateId = "template-quadratic";
        } else if (titleLower.includes("math problem")) {
          detectedTemplateId = "template-math";
        } else if (
          titleLower.includes("math") ||
          titleLower.includes("equation")
        ) {
          detectedTemplateId = "template-math";
          // Mind mapping & brainstorming
        } else if (titleLower.includes("mind map")) {
          detectedTemplateId = "template-mindmap";
        } else if (titleLower.includes("brainstorm")) {
          detectedTemplateId = "template-brainstorm";
          // Project management
        } else if (titleLower.includes("kanban")) {
          detectedTemplateId = "template-kanban";
        } else if (
          titleLower.includes("flowchart") ||
          titleLower.includes("flow chart")
        ) {
          detectedTemplateId = "template-flowchart";
          // Education
        } else if (
          titleLower.includes("teaching") ||
          titleLower.includes("lecture")
        ) {
          detectedTemplateId = "template-teaching";
        } else if (titleLower.includes("cornell")) {
          detectedTemplateId = "template-cornell";
          // Meetings
        } else if (titleLower.includes("meeting")) {
          detectedTemplateId = "template-meeting";
          // Design
        } else if (
          titleLower.includes("wireframe") ||
          titleLower.includes("wireframing")
        ) {
          detectedTemplateId = "template-wireframe";
          // Science
        } else if (
          titleLower.includes("physics") ||
          titleLower.includes("free body")
        ) {
          detectedTemplateId = "template-physics";
        } else if (
          titleLower.includes("chemistry") ||
          titleLower.includes("chemical") ||
          titleLower.includes("molecular")
        ) {
          detectedTemplateId = "template-chemistry";
        }
      }

      setTemplateId(detectedTemplateId);
      console.log(
        "[Board] Detected template:",
        detectedTemplateId,
        "from board:",
        board.title
      );

      // Fetch collaborators
      loadCollaborators();
    }
  }, [board, loadCollaborators]);

  // Directly fetch board data from database to ensure we have the latest content
  useEffect(() => {
    const loadBoardData = async () => {
      if (!id) return;

      try {
        console.log(
          "[Board] Directly fetching board data from database for:",
          id
        );
        const whiteboard = await fetchWhiteboard(id);

        if (whiteboard?.data) {
          console.log(
            "[Board] Direct fetch got data:",
            typeof whiteboard.data,
            Object.keys(whiteboard.data as object).length,
            "keys"
          );
          setBoardData(whiteboard.data);
        } else {
          console.log("[Board] Direct fetch returned no data");
        }
      } catch (error) {
        console.error("[Board] Error directly fetching board data:", error);
      }
    };

    loadBoardData();
  }, [id]);


  // Load saved Excalidraw data when board data is available
  useEffect(() => {
    const api = excalidrawAPIRef.current;
    if (!api || !boardData) return;

    // Check if board data is in Excalidraw format (version 2)
    const data = boardData as any;
    if (data.version === 2 && Array.isArray(data.elements)) {
      console.log("[Board] Loading", data.elements.length, "saved Excalidraw elements");
      api.updateScene({
        elements: data.elements,
        appState: data.appState || {},
      });
      toast.success(`Loaded ${data.elements.length} elements`);
    } else {
      console.log("[Board] Board data is not in Excalidraw format, starting fresh");
    }
  }, [boardData]);

  // Save Excalidraw data to Supabase - moved before conditional return for hooks order
  const handleSave = useCallback(async () => {
    const api = excalidrawAPIRef.current;
    if (!api || !id) {
      toast.error("Cannot save: Canvas or board not ready");
      return;
    }

    if (isSaving) {
      toast.info("Save already in progress...");
      return;
    }

    try {
      setIsSaving(true);
      
      const elements = api.getSceneElements();
      const appState = api.getAppState();

      const saveData = {
        elements: elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          gridSize: appState.gridSize,
        },
        savedAt: new Date().toISOString(),
        version: 2,
      };

      console.log("[Board] Saving", elements.length, "elements to Supabase");

      await updateBoard(id, {
        data: saveData as Record<string, unknown>,
      });

      setLastSaved(new Date());
      setBoardData(saveData);
      toast.success(`Saved ${elements.length} elements successfully!`);
    } catch (error) {
      console.error("[Board] Failed to save:", error);
      toast.error("Failed to save board");
    } finally {
      setIsSaving(false);
    }
  }, [id, isSaving, updateBoard]);

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

  const handleTitleSubmit = () => {
    if (title.trim() && title !== board.title) {
      updateBoard(board.id, { title: title.trim() });
      toast.success("Board renamed");
    }
    setIsEditing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  // Insert template-specific components (Excalidraw version)
  const insertTemplateComponent = (componentType: string, data?: any) => {
    const api = excalidrawAPIRef.current;
    if (!api) {
      toast.error("Canvas not ready yet");
      return;
    }

    console.log("[Board] Inserting component:", componentType, data);

    // Get text content from data
    const textContent = data?.symbol || data?.label || componentType;
    
    // Create a unique ID
    const elementId = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get current scene to find center position
    const appState = api.getAppState();
    const centerX = appState.scrollX + appState.width / 2;
    const centerY = appState.scrollY + appState.height / 2;

    // Create a text element
    const newElement = {
      id: elementId,
      type: "text",
      x: centerX - 50,
      y: centerY - 20,
      width: 100,
      height: 40,
      angle: 0,
      strokeColor: data?.color === "red" ? "#e03131" : 
                   data?.color === "blue" ? "#1971c2" :
                   data?.color === "green" ? "#2f9e44" :
                   data?.color === "yellow" ? "#f08c00" : "#1e1e1e",
      backgroundColor: "transparent",
      fillStyle: "hachure",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      text: textContent,
      fontSize: 20,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: null,
      originalText: textContent,
      lineHeight: 1.25,
    };

    // Add the element to the scene
    const currentElements = api.getSceneElements();
    api.updateScene({
      elements: [...currentElements, newElement],
    });

    toast.success(`Added: ${data?.label || componentType}`);
  };



  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Board Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
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
                Blank Page
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
                Ruled Lines
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collaborate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareBoardModalOpen(true)}
            className="gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Collaborate</span>
          </Button>

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="hidden sm:flex items-center -space-x-2 mr-2">
              {collaborators.slice(0, 3).map((collab) => (
                <Avatar key={collab.id} className="w-8 h-8 ring-2 ring-white">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                    {getInitials(
                      collab.user_profile?.name || collab.email || "U"
                    )}
                  </AvatarFallback>
                </Avatar>
              ))}
              {collaborators.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-medium ring-2 ring-white">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share className="w-4 h-4" />
            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleFavorite(board.id)}>
                {board.isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Canvas Area */}
      <main className="flex-1 relative bg-white overflow-hidden">
        {/* Template Library Floating Button - below Page 1 tab */}
        {templateId && templateId !== "template-blank" && (
          <div className="absolute top-12 left-4 z-20">
            <TemplateLibraryButton
              templateId={templateId}
              onInsertComponent={insertTemplateComponent}
            />
          </div>
        )}

        {/* Page lines background (optional) */}
        {pageFormat === "ruled" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(transparent 0px, transparent 31px, #e5e7eb 31px, #e5e7eb 32px),
                             linear-gradient(90deg, #fca5a5 0px, #fca5a5 1px, transparent 1px)`,
              backgroundSize: "100% 32px, 100% 32px",
              backgroundPosition: "0 0, 60px 0",
              zIndex: 1,
            }}
          />
        )}

        {/* Excalidraw canvas - must fill the container properly */}
        <div
          className="absolute inset-0"
          style={{ height: "100%", width: "100%" }}
        >
          <Excalidraw
            excalidrawAPI={(api) => { excalidrawAPIRef.current = api; }}
            theme="light"
            UIOptions={{
              canvasActions: {
                loadScene: false,
              }
            }}
          />
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        boardTitle={board.title}
      />

      {/* Team Collaborate Modal */}
      <TeamCollaborateModal
        open={shareBoardModalOpen}
        onOpenChange={setShareBoardModalOpen}
        boardId={board.id}
        boardTitle={board.title}
      />
    </div>
  );
}

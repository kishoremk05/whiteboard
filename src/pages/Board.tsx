import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Check,
  FileText,
  Users,
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
import { AIAssistanceToggle, type AIMode } from "../components/board/AIAssistanceToggle";
import { AIResponsePanel } from "../components/board/AIResponsePanel";
import { AIGeneratePanel } from "../components/board/AIGeneratePanel";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useBoards } from "../contexts/BoardContext";
import {
  fetchCollaborators,
  type CollaboratorWithUser,
} from "../lib/services/collaboratorService";
import { fetchWhiteboard } from "../lib/services/whiteboardService";
import { handleCanvasAnalysis } from "../lib/aiUtils";
import { generateFromText, generateFromImage } from "../lib/services/geminiService";
import { parseShapeCommands, insertShapesOnCanvas } from "../lib/shapeGenerator";
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
  const [aiMode, setAIMode] = useState<AIMode>("off");
  
  // AI State
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [aiError, setAIError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
        // Math-related templates
        if (titleLower.includes("math") || titleLower.includes("equation") || 
            titleLower.includes("calculus") || titleLower.includes("derivative") ||
            titleLower.includes("integral") || titleLower.includes("algebra") ||
            titleLower.includes("quadratic") || titleLower.includes("trigonometry")) {
          detectedTemplateId = "template-math";
        } else if (titleLower.includes("physics") || titleLower.includes("chemistry") ||
                   titleLower.includes("science") || titleLower.includes("biology")) {
          detectedTemplateId = "template-math"; // Use math template for science too
        } else if (titleLower.includes("mind map") || titleLower.includes("mindmap")) {
          detectedTemplateId = "template-mindmap";
        } else if (titleLower.includes("brainstorm")) {
          detectedTemplateId = "template-brainstorm";
        } else if (titleLower.includes("kanban") || titleLower.includes("task")) {
          detectedTemplateId = "template-kanban";
        } else if (titleLower.includes("flowchart") || titleLower.includes("flow chart") ||
                   titleLower.includes("diagram") || titleLower.includes("process")) {
          detectedTemplateId = "template-flowchart";
        } else if (titleLower.includes("wireframe") || titleLower.includes("ui") ||
                   titleLower.includes("design") || titleLower.includes("mockup")) {
          detectedTemplateId = "template-wireframe";
        } else if (titleLower.includes("timeline") || titleLower.includes("roadmap")) {
          detectedTemplateId = "template-timeline";
        } else if (titleLower.includes("org chart") || titleLower.includes("organization")) {
          detectedTemplateId = "template-org-chart";
        }
      }
      
      if (detectedTemplateId) {
        console.log("[Board] Detected template:", detectedTemplateId, "from title:", board.title);
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
        version: 3,  // Version 3 = TLDraw v2 compatible format
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
          
          // Only load version 3 data (new format without text on geo shapes)
          // Older data (version 1, 2) may have incompatible shape properties
          if (data.version === 3 && data.records && Array.isArray(data.records)) {
            console.log("[Board] Loading", data.records.length, "saved records (v3)");
            try {
              // Sanitize records to fix invalid colors
              const sanitizedRecords = data.records.map((record: any) => {
                // Only process shape records that have props with color
                if (record?.props?.color) {
                  const validColors = [
                    "black", "grey", "light-violet", "violet", "blue", "light-blue",
                    "yellow", "orange", "green", "light-green", "light-red", "red", "white"
                  ];
                  
                  const colorMap: Record<string, string> = {
                    "brown": "orange",
                    "purple": "violet",
                    "pink": "light-red",
                    "cyan": "light-blue",
                    "lime": "light-green",
                    "gray": "grey",
                  };
                  
                  const currentColor = String(record.props.color).toLowerCase();
                  
                  // Fix invalid color
                  if (!validColors.includes(currentColor)) {
                    const fixedColor = colorMap[currentColor] || "black";
                    console.log(`[Board] Fixed invalid color "${record.props.color}" -> "${fixedColor}" in ${record.typeName}`);
                    return {
                      ...record,
                      props: {
                        ...record.props,
                        color: fixedColor
                      }
                    };
                  }
                }
                return record;
              });
              
              editorRef.current.store.put(sanitizedRecords as any[]);
              toast.success("Board loaded!");
            } catch (error) {
              console.warn("[Board] Could not load saved data, starting fresh:", error);
              // Start fresh without crashing
            }
          } else {
            // Old format - start fresh (don't try to load incompatible data)
            console.log("[Board] Old data format (v" + (data.version || 1) + "), starting fresh");
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

  // Insert template component - using TLDraw v2 text shape with richText
  const insertTemplateComponent = useCallback((componentType: string, data?: Record<string, unknown>) => {
    if (!editorRef.current) {
      toast.error("Canvas not ready");
      return;
    }

    console.log("[Board] Inserting component:", componentType, data);
    
    const editor = editorRef.current;
    const center = editor.getViewportScreenCenter();
    const textContent = (data?.label as string) || (data?.symbol as string) || componentType;
    
    try {
      // TLDraw v2 text shapes require richText as a JSON structure
      // Format: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "..." }] }] }
      const richTextContent = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: textContent }
            ]
          }
        ]
      };

      // Create a text shape with richText
      editor.createShape({
        type: "text",
        x: center.x - 80,
        y: center.y - 20,
        props: {
          color: "black",
          size: "l",
          font: "draw",
          textAlign: "middle",
          w: 200,
          richText: richTextContent,
          scale: 1,
          autoSize: true,
        },
      });
      
      toast.success(`Added: ${textContent}`);
    } catch (error) {
      console.error("[Board] Error creating text shape:", error);
      // Fallback - create rectangle and copy to clipboard
      try {
        editor.createShape({
          type: "geo",
          x: center.x - 80,
          y: center.y - 40,
          props: { w: 160, h: 80, geo: "rectangle" },
        });
        navigator.clipboard.writeText(textContent).catch(() => {});
      } catch {
        // Ignore fallback errors
      }
      toast.info(`Press T then type: ${textContent}`, { duration: 5000 });
    }
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

          {/* Collaborate Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareBoardModalOpen(true)}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Collaborate</span>
          </Button>

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

        {/* AI Assistance Toggle */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <AIAssistanceToggle
            mode={aiMode}
            onModeChange={setAIMode}
            onAnalyze={async () => {
              setIsAnalyzing(true);
              setAIError(null);
              setAIResponse(null);
              const result = await handleCanvasAnalysis(editorRef.current, aiMode);
              setAIResponse(result.response);
              setAIError(result.error);
              setIsAnalyzing(false);
            }}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* AI Response Panel - only for analysis modes */}
        {aiMode !== "off" && aiMode !== "generate" && (aiResponse || aiError || isAnalyzing) && (
          <div className="absolute bottom-4 right-4 z-20">
            <AIResponsePanel
              mode={aiMode}
              content={aiResponse}
              error={aiError}
              isLoading={isAnalyzing}
              onClose={() => {
                setAIResponse(null);
                setAIError(null);
              }}
            />
          </div>
        )}

        {/* AI Generate Panel - only for generate mode */}
        {aiMode === "generate" && (
          <div className="absolute bottom-4 right-4 z-20">
            <AIGeneratePanel
              isGenerating={isGenerating}
              onClose={() => setAIMode("off")}
              onStop={() => {
                setIsGenerating(false);
                toast.info("Generation stopped");
              }}
              onGenerateFromText={async (prompt) => {
                if (!editorRef.current) return;
                setIsGenerating(true);
                try {
                  const result = await generateFromText(prompt);
                  if (result.success && result.content) {
                    const shapes = parseShapeCommands(result.content);
                    const count = insertShapesOnCanvas(editorRef.current, shapes);
                    if (count > 0) {
                      toast.success(`Generated ${count} shapes!`);
                    } else {
                      toast.warning("No valid shapes generated. Try a different prompt.");
                    }
                  } else {
                    toast.error(result.error || "Generation failed");
                  }
                } catch (error) {
                  toast.error("Generation failed");
                } finally {
                  setIsGenerating(false);
                }
              }}
              onGenerateFromImage={async (imageBase64) => {
                if (!editorRef.current) return;
                setIsGenerating(true);
                try {
                  const result = await generateFromImage(imageBase64);
                  if (result.success && result.content) {
                    const shapes = parseShapeCommands(result.content);
                    const count = insertShapesOnCanvas(editorRef.current, shapes);
                    if (count > 0) {
                      toast.success(`Generated ${count} shapes from image!`);
                    } else {
                      toast.warning("Couldn't recreate image. Try a simpler image.");
                    }
                  } else {
                    toast.error(result.error || "Generation failed");
                  }
                } catch (error) {
                  toast.error("Generation failed");
                } finally {
                  setIsGenerating(false);
                }
              }}
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

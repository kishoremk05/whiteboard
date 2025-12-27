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
import {
  Tldraw,
  createTLStore,
  defaultShapeUtils,
  createShapeId,
  type TLRecord,
  type Editor,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
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

  // Create tldraw store
  const [store] = useState(() =>
    createTLStore({
      shapeUtils: defaultShapeUtils,
    })
  );
  const saveTimeoutRef = useRef<number | undefined>(undefined);
  const loadedDataRef = useRef<string | null>(null); // Track what data we've loaded (by JSON hash)
  const hasLoadedOnceRef = useRef(false); // Track if we've done initial load
  const editorRef = useRef<Editor | null>(null); // Store tldraw Editor instance

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
      const isInternalTemplateId = detectedTemplateId?.startsWith('template-');
      
      if (!isInternalTemplateId && board.title) {
        const titleLower = board.title.toLowerCase();
        // Math-related templates
        if (titleLower.includes('calculus') || titleLower.includes('derivative')) {
          detectedTemplateId = 'template-calculus';
        } else if (titleLower.includes('quadratic')) {
          detectedTemplateId = 'template-quadratic';
        } else if (titleLower.includes('math problem')) {
          detectedTemplateId = 'template-math';
        } else if (titleLower.includes('math') || titleLower.includes('equation')) {
          detectedTemplateId = 'template-math';
        // Mind mapping & brainstorming
        } else if (titleLower.includes('mind map')) {
          detectedTemplateId = 'template-mindmap';
        } else if (titleLower.includes('brainstorm')) {
          detectedTemplateId = 'template-brainstorm';
        // Project management
        } else if (titleLower.includes('kanban')) {
          detectedTemplateId = 'template-kanban';
        } else if (titleLower.includes('flowchart') || titleLower.includes('flow chart')) {
          detectedTemplateId = 'template-flowchart';
        // Education
        } else if (titleLower.includes('teaching') || titleLower.includes('lecture')) {
          detectedTemplateId = 'template-teaching';
        } else if (titleLower.includes('cornell')) {
          detectedTemplateId = 'template-cornell';
        // Meetings
        } else if (titleLower.includes('meeting')) {
          detectedTemplateId = 'template-meeting';
        // Design
        } else if (titleLower.includes('wireframe') || titleLower.includes('wireframing')) {
          detectedTemplateId = 'template-wireframe';
        // Science
        } else if (titleLower.includes('physics') || titleLower.includes('free body')) {
          detectedTemplateId = 'template-physics';
        } else if (titleLower.includes('chemistry') || titleLower.includes('chemical') || titleLower.includes('molecular')) {
          detectedTemplateId = 'template-chemistry';
        }
      }
      
      setTemplateId(detectedTemplateId);
      console.log('[Board] Detected template:', detectedTemplateId, 'from board:', board.title);
      
      // Fetch collaborators
      loadCollaborators();
    }
  }, [board, loadCollaborators]);

  // Directly fetch board data from database to ensure we have the latest content
  useEffect(() => {
    const loadBoardData = async () => {
      if (!id) return;
      
      try {
        console.log("[Board] Directly fetching board data from database for:", id);
        const whiteboard = await fetchWhiteboard(id);
        
        if (whiteboard?.data) {
          console.log("[Board] Direct fetch got data:", typeof whiteboard.data, Object.keys(whiteboard.data as object).length, "keys");
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

  // Handle tldraw editor mount - load data AFTER tldraw is fully initialized
  const handleEditorMount = useCallback((editor: Editor) => {
    console.log("[Board] tldraw editor mounted");
    editorRef.current = editor;
    
    // Don't load if already loaded for this board
    if (hasLoadedOnceRef.current) {
      console.log("[Board] Already loaded once for this board, skipping onMount load");
      return;
    }
    
    // Use directly fetched boardData if available, otherwise fall back to context board.data
    const dataToUse = boardData || board?.data;
    
    if (!dataToUse) {
      console.log("[Board] No data to load on mount");
      hasLoadedOnceRef.current = true; // Mark as loaded even if empty
      return;
    }
    
    try {
      console.log("[Board] Loading data in onMount callback");
      console.log("[Board] Data type:", typeof dataToUse);
      console.log("[Board] Data keys:", Object.keys(dataToUse as object));
      
      // Handle different data structures
      let dataToLoad = dataToUse as Record<string, unknown>;
      
      // Check if data is wrapped in a 'store' property (tldraw snapshot format)
      if ('store' in dataToLoad && typeof dataToLoad.store === 'object') {
        dataToLoad = dataToLoad.store as Record<string, unknown>;
      }
      
      // Check if it has a document property (another tldraw format)
      if ('document' in dataToLoad && typeof dataToLoad.document === 'object') {
        const doc = dataToLoad.document as Record<string, unknown>;
        if ('store' in doc) {
          dataToLoad = doc.store as Record<string, unknown>;
        }
      }
      
      const snapshot = dataToLoad as Record<string, TLRecord>;
      if (snapshot && typeof snapshot === 'object' && Object.keys(snapshot).length > 0) {
        const allValues = Object.values(snapshot);
        console.log("[Board] Total values in snapshot:", allValues.length);
        console.log("[Board] Record types:", [...new Set(allValues.map((r: any) => r?.typeName))].join(', '));
        
        // Only filter for SHAPE records
        const shapeRecords = allValues.filter((record): record is TLRecord => {
          return record && 
                 typeof record === 'object' && 
                 'id' in record && 
                 'typeName' in record &&
                 (record as any).typeName === 'shape';
        });
        
        console.log("[Board] Shape records found:", shapeRecords.length);
        
        if (shapeRecords.length > 0) {
          // Get the current page from the store
          const pages = store.allRecords().filter(r => r.typeName === 'page');
          const currentPageId = pages.length > 0 ? pages[0].id : 'page:page';
          console.log("[Board] Current page ID:", currentPageId);
          
          // Update shapes to use correct parentId
          const shapesWithCorrectParent = shapeRecords.map(shape => {
            const shapeRecord = shape as any;
            if (shapeRecord.parentId && shapeRecord.parentId !== currentPageId) {
              return { ...shapeRecord, parentId: currentPageId };
            }
            return shape;
          });
          
          // CRITICAL: Defer to next tick to fix production timing issue
          // React production mode handles mount differently than dev mode
          setTimeout(() => {
            store.put(shapesWithCorrectParent);
            console.log("[Board] Loaded shapes via onMount (deferred):", shapesWithCorrectParent.length);
            
            // Zoom to fit the content so it's visible
            setTimeout(() => {
              try {
                editor.zoomToFit({ animation: { duration: 200 } });
                console.log("[Board] Zoomed to fit content");
              } catch (e) {
                console.log("[Board] Could not zoom to fit:", e);
              }
            }, 100);
          }, 0);
        }
      }
    } catch (error) {
      console.error("[Board] Failed to load data in onMount:", error);
    }
    
    hasLoadedOnceRef.current = true;
  }, [boardData, board?.data, store]);

  // Reset loaded flags when board ID changes
  useEffect(() => {
    loadedDataRef.current = null;
    hasLoadedOnceRef.current = false;
  }, [id]);

  // Auto-save on content changes (debounced)
  const handleSave = useCallback(async () => {
    if (!board || !store) return;

    try {
      setIsSaving(true);
      // Get only SHAPE records for saving - don't save internal tldraw state
      // (pages, cameras, pointers, etc. are managed by tldraw itself)
      const allRecords = store.allRecords();
      const shapeRecords = allRecords.filter(r => r.typeName === 'shape');
      
      const snapshot: Record<string, TLRecord> = {};
      shapeRecords.forEach((record) => {
        snapshot[record.id] = record;
      });

      await updateBoard(board.id, {
        data: snapshot as Record<string, unknown>,
      });

      setLastSaved(new Date());
      console.log("[Board] Content auto-saved");
    } catch (error) {
      console.error("[Board] Failed to save:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  }, [board, store, updateBoard]);

  // Listen to store changes and debounce save
  useEffect(() => {
    if (!store) return;

    const unsubscribe = store.listen(() => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save by 2 seconds
      saveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 2000);
    });

    return () => {
      unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [store, handleSave]);

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

  // Insert template-specific components
  const insertTemplateComponent = (componentType: string, data?: any) => {
    if (!store) return;

    console.log("Inserting component:", componentType, data);

    // Simple positioning - add near center
    const centerX = 500;
    const centerY = 400;

    const id = createShapeId();

    // Create shape based on component type
    let shape: TLRecord | null = null;

    if (componentType.startsWith('symbol-') || componentType === 'formula' || componentType === 'equation-box' || componentType.startsWith('equation-')) {
      // Text-based components
      const textContent = data?.symbol || data?.label || '';
      const showBorder = componentType === 'equation-box';
      const isEquation = componentType.startsWith('equation-') && componentType !== 'equation-box';
      
      // Use note shape for equations (editable) vs geo for symbols
      if (isEquation) {
        // Geo shape for equations - transparent border, just text
        shape = {
          id,
          type: 'geo',
          typeName: 'shape',
          x: centerX - 100,
          y: centerY - 30,
          rotation: 0,
          index: 'a1' as any,
          parentId: 'page:page' as any,
          isLocked: false,
          opacity: 1,
          props: {
            w: 200,
            h: 60,
            geo: 'rectangle',
            color: 'white',
            labelColor: 'black',
            fill: 'none',
            dash: 'draw',
            size: 'l',
            font: 'mono',
            align: 'middle',
            verticalAlign: 'middle',
            growY: 0,
            url: '',
            scale: 1,
            richText: {
              type: 'doc',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: textContent }] }],
            },
          },
          meta: {},
        } as any;
      } else {
        // Geo shape for symbols
        shape = {
          id,
          type: 'geo',
          typeName: 'shape',
          x: centerX - 40,
          y: centerY - 30,
          rotation: 0,
          index: 'a1' as any,
          parentId: 'page:page' as any,
          isLocked: false,
          opacity: 1,
          props: {
            w: 80,
            h: 60,
            geo: 'rectangle',
            color: showBorder ? 'black' : 'white',
            labelColor: 'black',
            fill: 'none',
            dash: 'draw',
            size: 'xl',
            font: 'mono',
            align: 'middle',
            verticalAlign: 'middle',
            growY: 0,
            url: '',
            scale: 1,
            richText: {
              type: 'doc',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: textContent }] }],
            },
          },
          meta: {},
        } as any;
      }
    } else if (componentType.startsWith('node-') || componentType.startsWith('priority-')) {
      // Colored nodes/boxes
      const textContent = data?.label || '';
      shape = {
        id,
        type: 'geo',
        typeName: 'shape',
        x: centerX - 75,
        y: centerY - 40,
        rotation: 0,
        index: 'a1' as any,
        parentId: 'page:page' as any,
        isLocked: false,
        opacity: 1,
        props: {
          w: 150,
          h: 80,
          geo: 'rectangle',
          color: data?.color || 'black',
          labelColor: 'black',
          fill: 'solid',
          dash: 'draw',
          size: 'm',
          font: 'draw',
          align: 'middle',
          verticalAlign: 'middle',
          growY: 0,
          url: '',
          scale: 1,
          richText: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: textContent }] }],
          },
        },
        meta: {},
      } as any;
    } else {
      // Default: rectangle box
      const textContent = data?.label || '';
      shape = {
        id,
        type: 'geo',
        typeName: 'shape',
        x: centerX - 100,
        y: centerY - 60,
        rotation: 0,
        index: 'a1' as any,
        parentId: 'page:page' as any,
        isLocked: false,
        opacity: 1,
        props: {
          w: 200,
          h: 120,
          geo: 'rectangle',
          color: 'black',
          labelColor: 'black',
          fill: 'semi',
          dash: 'draw',
          size: 'm',
          font: 'draw',
          align: 'middle',
          verticalAlign: 'middle',
          growY: 0,
          url: '',
          scale: 1,
          richText: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: textContent }] }],
          },
        },
        meta: {},
      } as any;
    }

    if (shape) {
      store.put([shape]);
      toast.success(`Added ${data?.label || 'component'}`);
    }
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

          {/* Manual Save Button */}
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
                <span>Save</span>
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
        {templateId && templateId !== 'template-blank' && (
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
        
        {/* Tldraw canvas - must fill the container properly */}
        <div className="absolute inset-0" style={{ height: '100%', width: '100%' }}>
          <Tldraw store={store} onMount={handleEditorMount} />
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

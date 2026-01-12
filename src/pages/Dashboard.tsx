import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Grid3x3, List } from "lucide-react";
import gsap from "gsap";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { BoardList } from "../components/dashboard/BoardList";
import { TemplateGallery } from "../components/dashboard/TemplateGallery";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { useBoards } from "../contexts/BoardContext";
import { useOnboarding } from "../lib/useOnboarding";
import { cn } from "../lib/utils";

type FilterType = "all" | "shared" | "owned";

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { boards, tags, filterByTag, createBoard } = useBoards();
  const {
    showOnboarding,
    completeOnboarding,
    isLoading: onboardingLoading,
  } = useOnboarding();
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const dashboardRef = useRef<HTMLDivElement>(null);

  const tagId = searchParams.get("tag");

  // Apply tag filter first
  let filteredBoards = tagId
    ? filterByTag(tagId)
    : boards.filter((b) => !b.isDeleted);

  // Then apply search filter if there's a search query
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredBoards = filteredBoards.filter(
      (board) =>
        board.title.toLowerCase().includes(lowerQuery) ||
        board.description?.toLowerCase().includes(lowerQuery)
    );
  }

  const currentTag = tagId ? tags.find((t: any) => t.id === tagId) : null;

  const handleNewBoard = async () => {
    const board = await createBoard("Untitled Board");
    navigate(`/board/${board.id}`);
  };

  // GSAP animations
  useEffect(() => {
    if (!dashboardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".dashboard-header", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(".board-list-container", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out",
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, [onboardingLoading, showOnboarding]);

  // Show loading
  if (onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <DashboardLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <div ref={dashboardRef} className="relative min-h-[calc(100vh-120px)]">
        {/* Page Header - Workspace style */}
        <div className="dashboard-header relative z-10 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title section */}
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Workspace
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {filteredBoards.length} {filteredBoards.length === 1 ? "board" : "boards"}
              </p>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    activeFilter === "all"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter("shared")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    activeFilter === "shared"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Shared
                </button>
                <button
                  onClick={() => setActiveFilter("owned")}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    activeFilter === "owned"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Owned
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  className="p-2 rounded-md bg-white text-slate-900 shadow-sm"
                  title="Grid view"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-md text-slate-600 hover:text-slate-900"
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Whiteboards Section */}
        <div className="board-list-container relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">Whiteboards</h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                {filteredBoards.length}
              </span>
            </div>
          </div>
          
          <BoardList
            boards={filteredBoards}
            emptyTitle={
              currentTag
                ? `No boards with "${currentTag.name}" tag`
                : "No boards yet"
            }
            emptyDescription={
              currentTag
                ? "Create a new board and add this tag to it."
                : "Ready to bring your ideas to life? Create your first board or start from a template."
            }
            showNewBoardCard={true}
            onNewBoard={handleNewBoard}
          />
        </div>

        {/* Template Gallery Modal */}
        <TemplateGallery
          open={templateGalleryOpen}
          onOpenChange={setTemplateGalleryOpen}
        />
      </div>
    </DashboardLayout>
  );
}

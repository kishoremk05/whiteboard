import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";
import gsap from "gsap";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { BoardList } from "../components/dashboard/BoardList";
import { TemplateGallery } from "../components/dashboard/TemplateGallery";
import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { Button } from "../components/ui/button";
import { useBoards } from "../contexts/BoardContext";
import { useOnboarding } from "../lib/useOnboarding";

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
  const dashboardRef = useRef<HTMLDivElement>(null);

  const tagId = searchParams.get("tag");
  const filteredBoards = tagId
    ? filterByTag(tagId)
    : boards.filter((b) => !b.isDeleted);
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
    <DashboardLayout>
      <div ref={dashboardRef} className="relative min-h-[calc(100vh-120px)]">
        {/* Dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d4d4d4 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Page Header - Clean professional style */}
        <div className="dashboard-header relative z-10 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title section */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {currentTag ? (
                  <span className="flex items-center gap-3">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentTag.color }}
                    />
                    {currentTag.name}
                  </span>
                ) : (
                  "My Boards"
                )}
              </h1>
              <p className="text-gray-500 mt-1 text-sm lg:text-base">
                {currentTag
                  ? `Boards tagged with "${currentTag.name}"`
                  : "Create and manage your whiteboards"}
              </p>
            </div>

            {/* Action buttons - aligned right */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setTemplateGalleryOpen(true)}
                className="gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-lg px-4 py-2 font-medium text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Templates
              </Button>
              <Button
                onClick={handleNewBoard}
                className="gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 font-medium text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Board
              </Button>
            </div>
          </div>
        </div>

        {/* Board List */}
        <div className="board-list-container relative z-10">
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

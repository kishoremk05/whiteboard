import { useState, useEffect, useCallback, useRef } from "react";
import { LayoutGrid, List, SortAsc, Check, ArrowUp } from "lucide-react";
import type { Board } from "../../types";
import { BoardCard } from "./BoardCard";
import { BoardCardSkeleton } from "./BoardCardSkeleton";
import { EmptyState } from "../shared/EmptyState";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";

interface BoardListProps {
  boards: Board[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
}

type SortOption = "updated" | "created" | "name";
type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 20;

export function BoardList({
  boards,
  isLoading,
  emptyTitle = "No boards yet",
  emptyDescription = "Create your first board to get started.",
  emptyIcon,
}: BoardListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [displayedBoards, setDisplayedBoards] = useState<Board[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort boards
  const sortedBoards = [...boards].sort((a, b) => {
    switch (sortBy) {
      case "updated":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "created":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Initialize displayed boards
  useEffect(() => {
    setDisplayedBoards(sortedBoards.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(sortedBoards.length > ITEMS_PER_PAGE);
  }, [boards, sortBy]);

  // Load more boards with animation
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    // Simulate network delay for smooth animation
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = nextPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newBoards = sortedBoards.slice(0, endIndex);

      setDisplayedBoards(newBoards);
      setPage(nextPage);
      setHasMore(endIndex < sortedBoards.length);
      setLoadingMore(false);
    }, 500);
  }, [page, hasMore, sortedBoards, loadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !loadingMore
        ) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading, loadingMore]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortLabels: Record<SortOption, string> = {
    updated: "Last modified",
    created: "Date created",
    name: "Name",
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-6 w-px bg-slate-200" />
            <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ animationDelay: `${i * 100}ms` }}>
              <BoardCardSkeleton viewMode={viewMode} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const progressPercentage = Math.min(
    (displayedBoards.length / boards.length) * 100,
    100
  );

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-slate-700">
            <span className="text-lg font-bold text-slate-900">
              {boards.length}
            </span>{" "}
            {boards.length === 1 ? "board" : "boards"}
          </p>
          {boards.length > ITEMS_PER_PAGE && (
            <>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {displayedBoards.length} of {boards.length}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 min-w-[140px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  <span>{sortLabels[sortBy]}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-slate-500">
                Sort by
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortBy("updated")}
                className="justify-between"
              >
                Last modified
                {sortBy === "updated" && (
                  <Check className="w-4 h-4 text-slate-600" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("created")}
                className="justify-between"
              >
                Date created
                {sortBy === "created" && (
                  <Check className="w-4 h-4 text-slate-600" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("name")}
                className="justify-between"
              >
                Name
                {sortBy === "name" && (
                  <Check className="w-4 h-4 text-slate-600" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-white shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewMode === "grid"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewMode === "list"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Board Grid/List */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-3"
        )}
      >
        {displayedBoards.map((board, index) => (
          <div
            key={board.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${Math.min(index * 50, 400)}ms`,
              animationFillMode: "both",
              animationDuration: "400ms",
            }}
          >
            <BoardCard board={board} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {hasMore && (
        <div
          ref={loaderRef}
          className="flex flex-col items-center justify-center py-12 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
              <div className="absolute inset-0 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                Loading more boards...
              </span>
              <span className="text-xs text-slate-500">
                {boards.length - displayedBoards.length} remaining
              </span>
            </div>
          </div>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && boards.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-8 h-px bg-slate-200" />
            <span className="text-sm">You've reached the end</span>
            <div className="w-8 h-px bg-slate-200" />
          </div>
          <p className="text-xs text-slate-400">
            Showing all {boards.length} boards
          </p>
        </div>
      )}

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg",
          "flex items-center justify-center transition-all duration-300 hover:bg-slate-800",
          "hover:scale-110 z-50",
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}

import { useState } from "react";
import { Star } from "lucide-react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { BoardList } from "../components/dashboard/BoardList";
import { useBoards } from "../contexts/BoardContext";

export function Favorites() {
  const { boards } = useBoards();
  const [searchQuery, setSearchQuery] = useState("");

  let favoriteBoards = boards.filter((b) => b.isFavorite && !b.isDeleted);

  // Apply search filter if there's a search query
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    favoriteBoards = favoriteBoards.filter(
      (board) =>
        board.title.toLowerCase().includes(lowerQuery) ||
        board.description?.toLowerCase().includes(lowerQuery)
    );
  }

  return (
    <DashboardLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Favorites
          </h1>
        </div>
        <p className="text-slate-500">Your starred boards for quick access</p>
      </div>

      {/* Board List */}
      <BoardList
        boards={favoriteBoards}
        emptyTitle="No favorites yet"
        emptyDescription="Star your important boards to find them quickly here."
        emptyIcon={<Star className="w-10 h-10 text-slate-400" />}
      />
    </DashboardLayout>
  );
}

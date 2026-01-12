import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { CommandPalette } from "../search/CommandPalette";

interface DashboardLayoutProps {
  children: ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function DashboardLayout({
  children,
  searchQuery,
  onSearchChange,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onSearchClick={() => setCommandPaletteOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
}

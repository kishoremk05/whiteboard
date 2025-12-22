import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Command,
  Sparkles,
  LogOut,
  Settings,
  Users,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../contexts/AuthContext";

import { getInitials, cn } from "../../lib/utils";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function DashboardHeader({
  onMenuClick,
  onSearchClick,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all lg:hidden active:scale-95"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          {/* Search Button */}
          <button
            onClick={onSearchClick}
            className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-all text-slate-500 w-72 group"
          >
            <Search className="w-4 h-4 group-hover:text-slate-700 transition-colors" />
            <span className="text-sm">Search boards...</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded-md border border-slate-200 font-mono shadow-sm">
                <Command className="w-2.5 h-2.5 inline-block" />
              </kbd>
              <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded-md border border-slate-200 font-mono shadow-sm">
                K
              </kbd>
            </div>
          </button>
          <button
            onClick={onSearchClick}
            className="sm:hidden p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
          >
            <Search className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Help */}
          <button className="hidden md:flex p-2.5 rounded-xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-700">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-all">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    Notifications
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    3 new
                  </Badge>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  {
                    title: "New comment on Design Board",
                    time: "5 min ago",
                    unread: true,
                  },
                  {
                    title: "Sarah shared a board with you",
                    time: "1 hour ago",
                    unread: true,
                  },
                  {
                    title: "Your export is ready",
                    time: "2 hours ago",
                    unread: true,
                  },
                ].map((notification, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-full p-3 text-left hover:bg-slate-50 transition-colors",
                      notification.unread && "bg-blue-50/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                          notification.unread ? "bg-blue-500" : "bg-slate-300"
                        )}
                      />
                      <div>
                        <p className="text-sm text-slate-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" className="w-full">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-all">
                <Avatar className="w-9 h-9 ring-2 ring-white shadow-md">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gray-900 text-white font-semibold">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-0">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gray-900 text-white font-semibold text-lg">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="bg-gray-900 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Pro Plan
                  </Badge>
                </div>
              </div>
              <div className="p-2">
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard/settings")}
                  className="gap-3 p-2.5 rounded-lg cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Settings
                  <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard/team")}
                  className="gap-3 p-2.5 rounded-lg cursor-pointer"
                >
                  <Users className="w-4 h-4 text-slate-500" />
                  Team
                  <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                </DropdownMenuItem>
              </div>
              <div className="p-2 border-t border-slate-100">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-3 p-2.5 rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

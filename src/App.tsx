import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
// import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BoardProvider } from "./contexts/BoardContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { CommandPalette } from "./components/search/CommandPalette";

// Pages
import { Landing } from "./pages/Landing";
// import { Login } from './pages/Login';
// import { SignUp } from './pages/SignUp';
// import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from "./pages/Dashboard";
import { Favorites } from "./pages/Favorites";
import { TrashPage } from "./pages/Trash";
import { Settings } from "./pages/Settings";
import { Team } from "./pages/Team";
import { Board } from "./pages/Board";

// Authentication logic removed

// Global command palette wrapper
function GlobalCommandPalette() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  return (
    <CommandPalette
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/favorites" element={<Favorites />} />
      <Route path="/dashboard/trash" element={<TrashPage />} />
      <Route path="/dashboard/settings" element={<Settings />} />
      <Route path="/dashboard/team" element={<Team />} />
      <Route path="/board/:id" element={<Board />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <BoardProvider>
          <TooltipProvider>
            <AppRoutes />
            <GlobalCommandPalette />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.1)",
                },
              }}
            />
          </TooltipProvider>
        </BoardProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

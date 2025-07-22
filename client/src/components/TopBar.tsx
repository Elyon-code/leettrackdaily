import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  currentPage: string;
  onAddClick?: () => void;
}

const pageDescriptions = {
  "Dashboard": "Welcome back! Let's crush some problems today 💪",
  "Problem Log": "Track and manage your LeetCode problem solutions",
  "Goals": "Set and track your coding goals",
  "Pattern Mastery": "Master algorithmic patterns through practice",
  "Settings": "Customize your LeetTrack experience"
};

export function TopBar({ currentPage, onAddClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentPage}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {pageDescriptions[currentPage] || "Welcome to LeetTrackDaily"}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="border-gray-200 dark:border-gray-700"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        {onAddClick && (
          <Button 
            onClick={onAddClick}
            className="bg-[#FF6B35] hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        )}
      </div>
    </header>
  );
}

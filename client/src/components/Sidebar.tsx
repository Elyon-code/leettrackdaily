import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Code, 
  BarChart3, 
  ListChecks, 
  Target, 
  Puzzle, 
  Settings,
  User
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Problem Log", href: "/problems", icon: ListChecks },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Pattern Mastery", href: "/patterns", icon: Puzzle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ currentPage }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-gray-700 fixed h-full z-30">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
            <Code className="text-white w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">LeetTrackDaily</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track your progress</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#FF6B35]/10 text-[#FF6B35] border-l-4 border-[#FF6B35]"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-200 dark:border-gray-700 absolute bottom-0 w-full">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-red-500 rounded-full flex items-center justify-center">
            <User className="text-white w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Smith</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Software Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

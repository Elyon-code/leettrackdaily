import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export function Layout({ children, currentPage }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0F0F0F]">
      <Sidebar currentPage={currentPage} />
      <main className="flex-1 ml-64 p-8">
        <TopBar currentPage={currentPage} />
        {children}
      </main>
    </div>
  );
}

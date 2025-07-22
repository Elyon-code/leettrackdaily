import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  currentUserId: number;
  motivationalQuotes: string[];
  getRandomQuote: () => string;
}

const motivationalQuotes = [
  "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
  "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
  "The best error message is the one that never shows up. - Thomas Fuchs",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "Make it work, make it right, make it fast. - Kent Beck",
  "Clean code always looks like it was written by someone who cares. - Robert C. Martin",
  "The computer was born to solve problems that did not exist before. - Bill Gates"
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId] = useState(1); // Default user for demo

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  return (
    <AppContext.Provider value={{
      currentUserId,
      motivationalQuotes,
      getRandomQuote
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

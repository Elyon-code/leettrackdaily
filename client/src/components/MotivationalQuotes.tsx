import React from "react";

const MOTIVATIONAL_QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    text: "In order to be irreplaceable, one must always be different.",
    author: "Coco Chanel"
  },
  {
    text: "Java is to JavaScript what car is to Carpet.",
    author: "Chris Heilmann"
  },
  {
    text: "Knowledge is power.",
    author: "Francis Bacon"
  },
  {
    text: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
    author: "Dan Salomon"
  },
  {
    text: "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.",
    author: "Antoine de Saint-Exupery"
  },
  {
    text: "Code never lies, comments sometimes do.",
    author: "Ron Jeffries"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  },
  {
    text: "Before software can be reusable it first has to be usable.",
    author: "Ralph Johnson"
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck"
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  }
];

export function MotivationalQuote() {
  // Get today's date to ensure the same quote shows all day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Use the day of year to select a quote, ensuring it rotates daily
  const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="bg-gradient-to-r from-[#FF6B35]/10 to-orange-100/10 dark:from-[#FF6B35]/20 dark:to-orange-900/20 border border-[#FF6B35]/20 rounded-xl p-6 mb-6">
      <div className="flex items-start space-x-4">
        <div className="text-4xl text-[#FF6B35] opacity-60">
          "
        </div>
        <div className="flex-1">
          <blockquote className="text-lg font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed">
            {quote.text}
          </blockquote>
          <cite className="block mt-3 text-sm font-semibold text-[#FF6B35] not-italic">
            — {quote.author}
          </cite>
        </div>
        <div className="text-4xl text-[#FF6B35] opacity-60 transform rotate-180">
          "
        </div>
      </div>
    </div>
  );
}
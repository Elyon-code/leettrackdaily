import React from "react";

interface HeatmapProps {
  data: Array<{ date: string; count: number }>;
  className?: string;
}

export function Heatmap({ data, className = "" }: HeatmapProps) {
  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-700";
    if (count <= 2) return "bg-[#00C896]/30";
    if (count <= 4) return "bg-[#00C896]/60";
    if (count <= 6) return "bg-[#FF6B35]/60";
    return "bg-[#FF375F]";
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en', { weekday: 'short' });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <span>More</span>
      </div>
      
      {data.map((item, index) => (
        <div key={item.date} className="flex items-center space-x-2">
          <span className="text-xs w-12 text-gray-600 dark:text-gray-400">
            {getDayName(item.date)}
          </span>
          <div className="flex space-x-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${
                  i < item.count ? getIntensity(item.count) : "bg-gray-200 dark:bg-gray-700"
                }`}
                title={`${item.date}: ${item.count} problems`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

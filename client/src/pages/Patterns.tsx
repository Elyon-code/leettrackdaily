import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Puzzle, TrendingUp, Target } from "lucide-react";

export default function Patterns() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: problems = [], isLoading: problemsLoading } = useQuery({
    queryKey: ["/api/problems"],
  });

  if (statsLoading || problemsLoading) {
    return (
      <Layout currentPage="Pattern Mastery">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Layout>
    );
  }

  const patternCounts = stats?.patternCounts || {};
  const totalPatterns = Object.keys(patternCounts).length;
  const totalProblems = Object.values(patternCounts).reduce((sum, count) => sum + count, 0);

  // Common patterns with expected problem counts for mastery
  const commonPatterns = [
    { name: "Two Pointers", target: 15, description: "Efficient array/string traversal technique" },
    { name: "Sliding Window", target: 12, description: "Optimize subarray/substring problems" },
    { name: "DFS/BFS", target: 25, description: "Tree and graph traversal algorithms" },
    { name: "Dynamic Programming", target: 30, description: "Optimization and memoization problems" },
    { name: "Binary Search", target: 15, description: "Logarithmic search in sorted data" },
    { name: "Hash Map", target: 20, description: "Fast lookups and frequency counting" },
    { name: "Greedy", target: 15, description: "Local optimal choices for global optimum" },
    { name: "Backtracking", target: 20, description: "Explore all possible solutions" },
    { name: "Sorting", target: 10, description: "Comparison and non-comparison sorting" },
    { name: "Linked List", target: 15, description: "Linear data structure manipulation" },
  ];

  const getPatternStats = (patternName: string, target: number) => {
    const solved = patternCounts[patternName] || 0;
    const progress = Math.min(100, Math.round((solved / target) * 100));
    const remaining = Math.max(0, target - solved);
    
    let level = "Beginner";
    let color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    
    if (progress >= 80) {
      level = "Expert";
      color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    } else if (progress >= 60) {
      level = "Advanced";
      color = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    } else if (progress >= 30) {
      level = "Intermediate";
      color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }

    return { solved, progress, remaining, level, color };
  };

  return (
    <Layout currentPage="Pattern Mastery">
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Patterns Practiced</p>
                  <p className="text-2xl font-bold mt-1">{totalPatterns}</p>
                </div>
                <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                  <Puzzle className="text-[#FF6B35] h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Problems</p>
                  <p className="text-2xl font-bold mt-1">{totalProblems}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Target className="text-blue-500 h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mastery Level</p>
                  <p className="text-2xl font-bold mt-1">
                    {totalPatterns > 0 ? Math.round((totalPatterns / commonPatterns.length) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-500 h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pattern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commonPatterns.map((pattern) => {
            const stats = getPatternStats(pattern.name, pattern.target);
            const problemsInPattern = problems.filter(p => p.pattern === pattern.name);

            return (
              <Card key={pattern.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-lg">{pattern.name}</CardTitle>
                        <Badge className={stats.color}>
                          {stats.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pattern.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {stats.solved}/{pattern.target} problems ({stats.progress}%)
                        </span>
                      </div>
                      <Progress value={stats.progress} className="h-3" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Solved</p>
                        <p className="font-medium text-green-600">{stats.solved}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Remaining</p>
                        <p className="font-medium text-orange-600">{stats.remaining}</p>
                      </div>
                    </div>

                    {/* Recent Problems */}
                    {problemsInPattern.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Recent Problems:</p>
                        <div className="space-y-1">
                          {problemsInPattern.slice(0, 3).map((problem) => (
                            <div key={problem.id} className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                problem.difficulty === 'Easy' ? 'bg-[#00C896]' :
                                problem.difficulty === 'Medium' ? 'bg-[#FFB800]' : 'bg-[#FF375F]'
                              }`} />
                              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {problem.name}
                              </span>
                            </div>
                          ))}
                          {problemsInPattern.length > 3 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              +{problemsInPattern.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Next Steps */}
                    {stats.remaining > 0 && (
                      <div className="bg-[#FF6B35]/10 p-3 rounded-lg">
                        <p className="text-xs text-[#FF6B35] font-medium">
                          💡 Practice {stats.remaining} more problems to master this pattern
                        </p>
                      </div>
                    )}

                    {stats.progress === 100 && (
                      <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          🎉 Pattern mastered! You're an expert in {pattern.name}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pattern-less Problems */}
        {problems.filter(p => !p.pattern).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Problems Without Patterns</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                These problems haven't been categorized yet. Consider adding patterns to improve your tracking.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {problems
                  .filter(p => !p.pattern)
                  .slice(0, 9)
                  .map((problem) => (
                    <div key={problem.id} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className={`w-2 h-2 rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-[#00C896]' :
                        problem.difficulty === 'Medium' ? 'bg-[#FFB800]' : 'bg-[#FF375F]'
                      }`} />
                      <span className="text-sm truncate">{problem.name}</span>
                    </div>
                  ))}
              </div>
              {problems.filter(p => !p.pattern).length > 9 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  +{problems.filter(p => !p.pattern).length - 9} more problems without patterns
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

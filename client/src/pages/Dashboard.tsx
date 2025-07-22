import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heatmap } from "@/components/ui/heatmap";
import { useApp } from "@/contexts/AppContext";
import { 
  Flame, 
  Calendar, 
  CheckCircle, 
  Target,
  TrendingUp,
  Clock,
  Quote
} from "lucide-react";

export default function Dashboard() {
  const { getRandomQuote } = useApp();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: problems, isLoading: problemsLoading } = useQuery({
    queryKey: ["/api/problems"],
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ["/api/goals"],
  });

  if (statsLoading || problemsLoading || goalsLoading) {
    return (
      <Layout currentPage="Dashboard">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const recentProblems = problems?.slice(0, 3) || [];
  const activeGoals = goals?.filter(g => g.status === 'Active').slice(0, 2) || [];
  const dailyGoal = 5; // Could come from user settings
  const progressPercentage = stats ? Math.round((stats.todaysSolved / dailyGoal) * 100) : 0;

  return (
    <Layout currentPage="Dashboard">
      <div className="space-y-8">
        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-[#FF6B35] to-red-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Quote className="h-5 w-5 opacity-70" />
              <span className="font-medium">Daily Motivation</span>
            </div>
            <p className="text-lg font-medium">{getRandomQuote()}</p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Today's Reps</p>
                  <p className="text-2xl font-bold mt-1">
                    <span className="text-[#FF6B35]">{stats?.todaysSolved || 0}</span>
                    <span className="text-gray-400 text-lg">/ {dailyGoal}</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                  <Flame className="text-[#FF6B35] h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={progressPercentage} className="h-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{progressPercentage}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Current Streak</p>
                  <p className="text-2xl font-bold mt-1">
                    <span className="text-green-500">{stats?.currentStreak || 0}</span>
                    <span className="text-gray-400 text-lg"> days</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="text-green-500 h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Keep it going! 🔥
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Solved</p>
                  <p className="text-2xl font-bold mt-1">{stats?.totalSolved || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-blue-500 h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-[#00C896]">Easy: {stats?.difficultyCounts.easy || 0}</span> • 
                  <span className="text-[#FFB800] ml-1">Med: {stats?.difficultyCounts.medium || 0}</span> • 
                  <span className="text-[#FF375F] ml-1">Hard: {stats?.difficultyCounts.hard || 0}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Goal Progress</p>
                  <p className="text-2xl font-bold mt-1">
                    <span className="text-purple-500">
                      {activeGoals.length > 0 ? Math.round((activeGoals[0].currentProgress / activeGoals[0].targetProblems) * 100) : 0}
                    </span>
                    <span className="text-gray-400 text-lg">%</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Target className="text-purple-500 h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  {activeGoals.length > 0 ? activeGoals[0].name : "No active goals"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#FF6B35]" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Heatmap data={stats?.weeklyActivity || []} />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-[#FF6B35]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProblems.length > 0 ? (
                  recentProblems.map((problem) => (
                    <div key={problem.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        problem.difficulty === 'Easy' ? 'bg-[#00C896]' :
                        problem.difficulty === 'Medium' ? 'bg-[#FFB800]' : 'bg-[#FF375F]'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {problem.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {problem.pattern && (
                            <Badge variant="secondary" className="text-xs">
                              {problem.pattern}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(problem.solvedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No problems logged yet. Start coding!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Goals</CardTitle>
                <button className="text-[#FF6B35] hover:text-orange-600 text-sm font-medium">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeGoals.length > 0 ? (
                  activeGoals.map((goal) => {
                    const progress = Math.round((goal.currentProgress / goal.targetProblems) * 100);
                    const daysRemaining = goal.deadline 
                      ? Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                      : null;

                    return (
                      <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{goal.name}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{progress}% Complete</span>
                        </div>
                        <Progress value={progress} className="mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {goal.currentProgress}/{goal.targetProblems} problems completed
                        </p>
                        {daysRemaining !== null && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {daysRemaining} days remaining
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No active goals. Create one to start tracking!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pattern Mastery Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pattern Mastery</CardTitle>
                <button className="text-[#FF6B35] hover:text-orange-600 text-sm font-medium">
                  View All
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.patternCounts && Object.keys(stats.patternCounts).length > 0 ? (
                  Object.entries(stats.patternCounts).slice(0, 3).map(([pattern, count]) => (
                    <div key={pattern}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{pattern}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{count} problems</span>
                      </div>
                      <Progress value={Math.min(100, (count / 20) * 100)} className="h-2" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No patterns tracked yet. Add problems with patterns!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

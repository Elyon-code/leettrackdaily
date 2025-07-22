import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Layout } from "@/components/Layout";
import { GoalForm } from "@/components/GoalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Calendar, Target, TrendingUp } from "lucide-react";
import type { Goal, InsertGoal } from "@shared/schema";

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { toast } = useToast();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["/api/goals"],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertGoal) => apiRequest("POST", "/api/goals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Goal created!",
        description: "Your new goal has been added successfully.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Goal> }) =>
      apiRequest("PUT", `/api/goals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setEditingGoal(null);
      toast({
        title: "Goal updated!",
        description: "Your goal has been updated successfully.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/goals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Goal deleted",
        description: "The goal has been removed.",
      });
    },
  });

  const handleCreate = async (data: InsertGoal) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (data: InsertGoal) => {
    if (!editingGoal) return;
    await updateMutation.mutateAsync({ id: editingGoal.id, data });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteMutation.mutate(id);
    }
  };

  const calculateDaysRemaining = (deadline: Date | null) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDailyTarget = (goal: Goal) => {
    const remaining = goal.targetProblems - goal.currentProgress;
    const daysRemaining = calculateDaysRemaining(goal.deadline);
    if (!daysRemaining || daysRemaining <= 0) return 0;
    return Math.ceil(remaining / daysRemaining);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Layout currentPage="Goals">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
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

  const activeGoals = goals.filter(goal => goal.status === 'Active');
  const completedGoals = goals.filter(goal => goal.status === 'Completed');

  return (
    <Layout currentPage="Goals" onAddClick={() => setShowForm(true)}>
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Goals</p>
                  <p className="text-2xl font-bold mt-1">{activeGoals.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                  <Target className="text-[#FF6B35] h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed Goals</p>
                  <p className="text-2xl font-bold mt-1">{completedGoals.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-500 h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Problems</p>
                  <p className="text-2xl font-bold mt-1">
                    {goals.reduce((sum, goal) => sum + goal.targetProblems, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-500 h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.length > 0 ? (
            goals.map((goal) => {
              const progress = Math.round((goal.currentProgress / goal.targetProblems) * 100);
              const daysRemaining = calculateDaysRemaining(goal.deadline);
              const dailyTarget = calculateDailyTarget(goal);
              const isOverdue = daysRemaining !== null && daysRemaining < 0;

              return (
                <Card key={goal.id} className={isOverdue ? "border-red-200 dark:border-red-800" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-xl">{goal.name}</CardTitle>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status}
                          </Badge>
                          {isOverdue && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        {goal.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(goal.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {goal.currentProgress}/{goal.targetProblems} problems ({progress}%)
                          </span>
                        </div>
                        <Progress value={progress} className="h-3" />
                      </div>

                      {/* Goal Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Target</p>
                          <p className="font-medium">{goal.targetProblems} problems</p>
                        </div>
                        {goal.deadline && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Deadline</p>
                            <p className="font-medium">
                              {new Date(goal.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {daysRemaining !== null && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {isOverdue ? "Overdue by" : "Days remaining"}
                            </p>
                            <p className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>
                              {Math.abs(daysRemaining)} days
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Daily Target */}
                      {goal.status === 'Active' && dailyTarget > 0 && (
                        <div className="bg-[#FF6B35]/10 p-3 rounded-lg">
                          <p className="text-sm text-[#FF6B35] font-medium">
                            Daily Target: {dailyTarget} problems/day to meet deadline
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No goals set yet. Create your first goal to start tracking progress!
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-[#FF6B35] hover:bg-orange-600 text-white"
                >
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Goal Form */}
      <GoalForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
      />

      {/* Edit Goal Form */}
      <GoalForm
        open={!!editingGoal}
        onOpenChange={() => setEditingGoal(null)}
        onSubmit={handleUpdate}
        initialData={editingGoal || undefined}
        isEdit
      />
    </Layout>
  );
}

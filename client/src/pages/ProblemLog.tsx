import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Layout } from "@/components/Layout";
import { ProblemForm } from "@/components/ProblemForm";
import { Timer } from "@/components/Timer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import type { Problem, InsertProblem } from "@shared/schema";

export default function ProblemLog() {
  const [showForm, setShowForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "All",
    status: "All",
    pattern: "All",
  });
  const { toast } = useToast();

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ["/api/problems", filters],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProblem & { screenshot?: File }) => {
      const formData = new FormData();
      
      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'screenshot') return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append file if exists
      if (data.screenshot) {
        formData.append('screenshot', data.screenshot);
      }

      return apiRequest("POST", "/api/problems", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/problems"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Problem> & { screenshot?: File } }) => {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'screenshot') return;
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (data.screenshot) {
        formData.append('screenshot', data.screenshot);
      }

      return apiRequest("PUT", `/api/problems/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/problems"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setEditingProblem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/problems/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/problems"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Problem deleted",
        description: "The problem has been removed from your log.",
      });
    },
  });

  const handleCreate = async (data: InsertProblem & { screenshot?: File }) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (data: InsertProblem & { screenshot?: File }) => {
    if (!editingProblem) return;
    await updateMutation.mutateAsync({ id: editingProblem.id, data });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      deleteMutation.mutate(id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-[#00C896] text-white';
      case 'Medium': return 'bg-[#FFB800] text-white';
      case 'Hard': return 'bg-[#FF375F] text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Layout currentPage="Problem Log">
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="Problem Log" onAddClick={() => setShowForm(true)}>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search problems..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={filters.difficulty}
                onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.pattern}
                onValueChange={(value) => setFilters({ ...filters, pattern: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Patterns</SelectItem>
                  <SelectItem value="Two Pointers">Two Pointers</SelectItem>
                  <SelectItem value="Sliding Window">Sliding Window</SelectItem>
                  <SelectItem value="DFS/BFS">DFS/BFS</SelectItem>
                  <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
                  <SelectItem value="Binary Search">Binary Search</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problem Table */}
        <Card>
          <CardContent className="p-0">
            {problems.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead>Problem</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Pattern</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map((problem) => (
                      <TableRow key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {problem.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {problem.topics.join(", ")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {problem.pattern && (
                            <Badge variant="secondary">
                              {problem.pattern}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(problem.status)}>
                            {problem.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(problem.solvedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Timer problemId={problem.id} problemName={problem.name} />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingProblem(problem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(problem.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No problems logged yet. Start tracking your progress!
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-[#FF6B35] hover:bg-orange-600 text-white"
                >
                  Add Your First Problem
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Problem Form */}
      <ProblemForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreate}
      />

      {/* Edit Problem Form */}
      <ProblemForm
        open={!!editingProblem}
        onOpenChange={() => setEditingProblem(null)}
        onSubmit={handleUpdate}
        initialData={editingProblem || undefined}
        isEdit
      />
    </Layout>
  );
}

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProblemSchema, type InsertProblem } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertProblemSchema.extend({
  topicsString: z.string().optional(),
  tagsString: z.string().optional(),
  reviewedSolution1: z.string().optional(),
  reviewedSolution2: z.string().optional(),
  reminderDate: z.string().optional(),
  timeSpent: z.number().optional(),
});

interface ProblemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertProblem & { screenshot?: File }) => Promise<void>;
  initialData?: Partial<InsertProblem>;
  isEdit?: boolean;
}

export function ProblemForm({ open, onOpenChange, onSubmit, initialData, isEdit }: ProblemFormProps) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      difficulty: initialData?.difficulty || "Easy",
      status: initialData?.status || "Solved",
      topicsString: initialData?.topics?.join(", ") || "",
      tagsString: initialData?.tags?.join(", ") || "",
      timeComplexity: initialData?.timeComplexity || "",
      spaceComplexity: initialData?.spaceComplexity || "",
      pattern: initialData?.pattern || "",
      whyApplies: initialData?.whyApplies || "",
      variations: initialData?.variations || "",
      thoughtProcess: initialData?.thoughtProcess || "",
      pseudocode: initialData?.pseudocode || "",
      reviewedSolution1: initialData?.reviewedSolution1 || "",
      reviewedSolution2: initialData?.reviewedSolution2 || "",
      reminderDate: initialData?.reminderDate ? new Date(initialData.reminderDate).toISOString().slice(0, 16) : "",
      timeSpent: initialData?.timeSpent || undefined,
      userId: 1,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { topicsString, tagsString, reminderDate, ...data } = values;
      
      const problemData: InsertProblem & { screenshot?: File } = {
        ...data,
        topics: topicsString ? topicsString.split(",").map(t => t.trim()).filter(Boolean) : [],
        tags: tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [],
        reminderDate: reminderDate ? new Date(reminderDate) : undefined,
      };

      if (screenshot) {
        problemData.screenshot = screenshot;
      }

      await onSubmit(problemData);
      onOpenChange(false);
      form.reset();
      setScreenshot(null);
      
      toast({
        title: isEdit ? "Problem updated!" : "Problem added!",
        description: isEdit ? "Your problem has been updated successfully." : "Your problem has been logged successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setScreenshot(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Problem" : "Add New Problem"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Two Sum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topicsString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topics/Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Array, Hash Table" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Solved">Solved</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeComplexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Complexity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., O(n)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spaceComplexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Space Complexity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., O(1)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pattern/Algorithm Used</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hash Map, Two Pointers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thoughtProcess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thought Process</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your approach and reasoning..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pseudocode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pseudocode</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your pseudocode here..."
                      rows={6}
                      className="font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variations/Similar Problems</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List similar problems or variations..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewedSolution1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewed Solution #1 Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes from reviewing solution #1..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reviewedSolution2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewed Solution #2 Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes from reviewing solution #2..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="reminderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Set Reminder (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g., 45"
                        {...field}
                        onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Code Screenshot (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {screenshot ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{screenshot.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setScreenshot(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="text-gray-400 text-2xl mb-2 mx-auto h-8 w-8" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Drag and drop your code screenshot here, or click to browse
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="cursor-pointer inline-block mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Choose File
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FF6B35] hover:bg-orange-600 text-white"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Update Problem" : "Save Problem"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

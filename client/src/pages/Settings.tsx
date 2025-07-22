import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Moon, Sun, Bell, Trash2, Save } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    dailyGoal: 5,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", "/api/user", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated!",
        description: "Your settings have been updated successfully.",
      });
    },
  });

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || "",
        email: user.email || "",
        dailyGoal: user.dailyGoal || 5,
      });
    }
  }, [user]);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(userForm);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    updateSettingsMutation.mutate({
      theme: theme === "light" ? "dark" : "light",
    });
  };

  const handleNotificationToggle = (enabled: boolean) => {
    updateSettingsMutation.mutate({
      notifications: enabled,
    });
  };

  const handleDataReset = () => {
    if (confirm("Are you sure you want to reset all your data? This action cannot be undone.")) {
      // This would need to be implemented as a separate API endpoint
      toast({
        title: "Feature coming soon",
        description: "Data reset functionality will be available in a future update.",
      });
    }
  };

  if (userLoading || settingsLoading) {
    return (
      <Layout currentPage="Settings">
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

  return (
    <Layout currentPage="Settings">
      <div className="space-y-8 max-w-2xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Daily Goal</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={userForm.dailyGoal}
                  onChange={(e) => setUserForm({ ...userForm, dailyGoal: parseInt(e.target.value) || 5 })}
                  placeholder="5"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Number of problems you want to solve per day
                </p>
              </div>

              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="bg-[#FF6B35] hover:bg-orange-600 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateUserMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {theme === "dark" ? (
                <Moon className="mr-2 h-5 w-5" />
              ) : (
                <Sun className="mr-2 h-5 w-5" />
              )}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get reminded to complete your daily goal
                  </p>
                </div>
                <Switch
                  checked={settings?.notifications || false}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 Notification features are coming soon! You'll be able to set custom reminder times and notification preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="mr-2 h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Reset all your data including problems, goals, and progress. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDataReset}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About LeetTrackDaily</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>Version: 1.0.0</p>
              <p>Build: Development</p>
              <p className="text-xs mt-4">
                LeetTrackDaily helps you track and visualize your LeetCode progress with detailed analytics,
                pattern mastery tracking, and goal management features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

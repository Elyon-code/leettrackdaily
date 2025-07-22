import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { insertProblemSchema, insertGoalSchema, insertUserSettingsSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Configure nodemailer (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'demo@example.com',
    pass: process.env.EMAIL_PASS || 'demo-password'
  }
});

// Email service functions
const sendReminderEmail = async (to: string, type: 'daily' | 'goal' | 'milestone', data: any) => {
  const templates = {
    daily: {
      subject: "🔥 LeetTrackDaily - Time to code!",
      html: `
        <h2>Don't break the chain! 🔗</h2>
        <p>You have <strong>${data.remainingToday}</strong> problems left to reach your daily goal.</p>
        <p>Current streak: <strong>${data.streak} days</strong></p>
        <p><a href="http://localhost:5000">Continue your coding journey</a></p>
      `
    },
    goal: {
      subject: "🎯 Goal Reminder - LeetTrackDaily",
      html: `
        <h2>Goal Reminder: ${data.goalName}</h2>
        <p>Progress: <strong>${data.progress}/${data.target}</strong> problems completed</p>
        <p>Deadline: <strong>${data.deadline}</strong></p>
        <p><a href="http://localhost:5000">Track your progress</a></p>
      `
    },
    milestone: {
      subject: "🎉 Milestone Achieved - LeetTrackDaily",
      html: `
        <h2>Congratulations! 🎉</h2>
        <p>You've reached a new milestone: <strong>${data.milestone}</strong></p>
        <p>Total problems solved: <strong>${data.totalSolved}</strong></p>
        <p>Keep up the amazing work!</p>
      `
    }
  };

  const template = templates[type];
  await transporter.sendMail({
    from: process.env.EMAIL_USER || 'demo@example.com',
    to,
    subject: template.subject,
    html: template.html
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Default user ID for demo purposes
  const DEFAULT_USER_ID = 1;

  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/user", async (req, res) => {
    try {
      const user = await storage.updateUser(DEFAULT_USER_ID, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Problem routes
  app.get("/api/problems", async (req, res) => {
    try {
      const { search, difficulty, status, pattern } = req.query;
      const problems = await storage.getProblemsWithFilters(DEFAULT_USER_ID, {
        search: search as string,
        difficulty: difficulty as string,
        status: status as string,
        pattern: pattern as string,
      });
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  app.get("/api/problems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const problem = await storage.getProblem(id);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problem" });
    }
  });

  app.post("/api/problems", upload.single('screenshot'), async (req, res) => {
    try {
      const validatedData = insertProblemSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
        topics: req.body.topics ? JSON.parse(req.body.topics) : [],
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        screenshotUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });
      
      const problem = await storage.createProblem(validatedData);
      res.status(201).json(problem);
    } catch (error) {
      res.status(400).json({ message: "Invalid problem data", error: error.message });
    }
  });

  app.put("/api/problems/:id", upload.single('screenshot'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = { ...req.body };
      
      if (req.body.topics) {
        updateData.topics = JSON.parse(req.body.topics);
      }
      if (req.body.tags) {
        updateData.tags = JSON.parse(req.body.tags);
      }
      if (req.file) {
        updateData.screenshotUrl = `/uploads/${req.file.filename}`;
      }
      
      const problem = await storage.updateProblem(id, updateData);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update problem", error: error.message });
    }
  });

  app.delete("/api/problems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProblem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete problem" });
    }
  });

  // Goal routes
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals(DEFAULT_USER_ID);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID,
      });
      
      const goal = await storage.createGoal(validatedData);
      res.status(201).json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data", error: error.message });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.updateGoal(id, req.body);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGoal(id);
      if (!deleted) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings(DEFAULT_USER_ID);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateUserSettings(DEFAULT_USER_ID, req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Failed to update settings" });
    }
  });

  // Analytics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(DEFAULT_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Reminder routes
  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await storage.getPendingReminders();
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.post("/api/send-reminders", async (req, res) => {
    try {
      const user = await storage.getUser(DEFAULT_USER_ID);
      const settings = await storage.getUserSettings(DEFAULT_USER_ID);
      const stats = await storage.getUserStats(DEFAULT_USER_ID);
      
      if (!user?.email || !settings?.emailReminders) {
        return res.json({ sent: 0, message: "Email reminders not configured" });
      }

      let emailsSent = 0;
      
      // Send daily reminder if enabled
      if (settings.notifications) {
        await sendReminderEmail(user.email, 'daily', {
          remainingToday: Math.max(0, (user.dailyGoal || 5) - (stats?.todaysSolved || 0)),
          streak: stats?.currentStreak || 0
        });
        emailsSent++;
      }

      // Check for goal reminders
      const goals = await storage.getGoals(DEFAULT_USER_ID);
      for (const goal of goals) {
        if (goal.reminderDate && new Date(goal.reminderDate) <= new Date()) {
          await sendReminderEmail(user.email, 'goal', {
            goalName: goal.name,
            progress: goal.currentProgress,
            target: goal.targetProblems,
            deadline: goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'
          });
          emailsSent++;
        }
      }

      res.json({ sent: emailsSent, message: `Sent ${emailsSent} reminder emails` });
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ message: "Failed to send reminders" });
    }
  });

  // Milestone celebration route
  app.post("/api/celebrate-milestone", async (req, res) => {
    try {
      const { milestone, totalSolved } = req.body;
      const user = await storage.getUser(DEFAULT_USER_ID);
      const settings = await storage.getUserSettings(DEFAULT_USER_ID);
      
      if (user?.email && settings?.emailReminders) {
        await sendReminderEmail(user.email, 'milestone', {
          milestone,
          totalSolved
        });
      }
      
      res.json({ success: true, message: "Milestone celebration sent!" });
    } catch (error) {
      console.error('Milestone error:', error);
      res.status(500).json({ message: "Failed to send milestone celebration" });
    }
  });

  // Streak routes
  app.post("/api/streak/update", async (req, res) => {
    try {
      const result = await storage.updateStreak(DEFAULT_USER_ID);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update streak" });
    }
  });

  app.post("/api/streak/reset", async (req, res) => {
    try {
      await storage.resetStreak(DEFAULT_USER_ID);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset streak" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  }, express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}

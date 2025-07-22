import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  avatar: text("avatar"),
  dailyGoal: integer("daily_goal").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow(),
});

export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  difficulty: text("difficulty").notNull(), // 'Easy', 'Medium', 'Hard'
  topics: text("topics").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default('Solved'), // 'Solved', 'In Progress'
  timeComplexity: text("time_complexity"),
  spaceComplexity: text("space_complexity"),
  pattern: text("pattern"),
  whyApplies: text("why_applies"),
  variations: text("variations"),
  thoughtProcess: text("thought_process"),
  pseudocode: text("pseudocode"),
  screenshotUrl: text("screenshot_url"),
  reviewedSolution1: text("reviewed_solution_1"),
  reviewedSolution2: text("reviewed_solution_2"),
  reminderDate: timestamp("reminder_date"),
  timeSpent: integer("time_spent"), // in minutes
  solvedAt: timestamp("solved_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  targetProblems: integer("target_problems").notNull(),
  currentProgress: integer("current_progress").notNull().default(0),
  deadline: timestamp("deadline"),
  status: text("status").notNull().default('Active'), // 'Active', 'Completed', 'Paused'
  reminderDate: timestamp("reminder_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  theme: text("theme").notNull().default('dark'), // 'light', 'dark'
  notifications: boolean("notifications").notNull().default(true),
  reminderTime: text("reminder_time"),
  reminderEmail: text("reminder_email"),
  currentStreak: integer("current_streak").notNull().default(0),
  lastActiveDate: timestamp("last_active_date"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProblemSchema = createInsertSchema(problems).omit({
  id: true,
  createdAt: true,
  solvedAt: true,
}).extend({
  topics: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

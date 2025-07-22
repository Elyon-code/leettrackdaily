import { 
  users, problems, goals, userSettings,
  type User, type InsertUser,
  type Problem, type InsertProblem,
  type Goal, type InsertGoal,
  type UserSettings, type InsertUserSettings
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Problem operations
  getProblems(userId: number): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  createProblem(problem: InsertProblem): Promise<Problem>;
  updateProblem(id: number, problem: Partial<Problem>): Promise<Problem | undefined>;
  deleteProblem(id: number): Promise<boolean>;
  getProblemsWithFilters(userId: number, filters: {
    search?: string;
    difficulty?: string;
    status?: string;
    pattern?: string;
  }): Promise<Problem[]>;

  // Goal operations
  getGoals(userId: number): Promise<Goal[]>;
  getGoal(id: number): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;

  // User settings operations
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings>;

  // Analytics operations
  getUserStats(userId: number): Promise<{
    totalSolved: number;
    todaysSolved: number;
    currentStreak: number;
    difficultyCounts: { easy: number; medium: number; hard: number };
    patternCounts: Record<string, number>;
    weeklyActivity: Array<{ date: string; count: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private problems: Map<number, Problem>;
  private goals: Map<number, Goal>;
  private userSettings: Map<number, UserSettings>;
  private currentUserId: number;
  private currentProblemId: number;
  private currentGoalId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.problems = new Map();
    this.goals = new Map();
    this.userSettings = new Map();
    this.currentUserId = 1;
    this.currentProblemId = 1;
    this.currentGoalId = 1;
    this.currentSettingsId = 1;

    // Create default user
    this.createUser({
      username: "johndoe",
      name: "John Smith",
      email: "john@example.com",
      dailyGoal: 5
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    
    // Create default settings for user
    await this.updateUserSettings(id, { theme: 'dark', notifications: true });
    
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getProblems(userId: number): Promise<Problem[]> {
    return Array.from(this.problems.values()).filter(problem => problem.userId === userId);
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    return this.problems.get(id);
  }

  async createProblem(insertProblem: InsertProblem): Promise<Problem> {
    const id = this.currentProblemId++;
    const problem: Problem = {
      ...insertProblem,
      id,
      topics: insertProblem.topics || [],
      tags: insertProblem.tags || [],
      createdAt: new Date(),
      solvedAt: new Date()
    };
    this.problems.set(id, problem);
    return problem;
  }

  async updateProblem(id: number, updateData: Partial<Problem>): Promise<Problem | undefined> {
    const problem = this.problems.get(id);
    if (!problem) return undefined;
    
    const updatedProblem = { ...problem, ...updateData };
    this.problems.set(id, updatedProblem);
    return updatedProblem;
  }

  async deleteProblem(id: number): Promise<boolean> {
    return this.problems.delete(id);
  }

  async getProblemsWithFilters(userId: number, filters: {
    search?: string;
    difficulty?: string;
    status?: string;
    pattern?: string;
  }): Promise<Problem[]> {
    let problems = await this.getProblems(userId);

    if (filters.search) {
      const search = filters.search.toLowerCase();
      problems = problems.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.topics.some(t => t.toLowerCase().includes(search)) ||
        p.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    if (filters.difficulty && filters.difficulty !== 'All') {
      problems = problems.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.status && filters.status !== 'All') {
      problems = problems.filter(p => p.status === filters.status);
    }

    if (filters.pattern && filters.pattern !== 'All') {
      problems = problems.filter(p => p.pattern === filters.pattern);
    }

    return problems;
  }

  async getGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const goal: Goal = {
      ...insertGoal,
      id,
      createdAt: new Date()
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, updateData: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...updateData };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(settings => settings.userId === userId);
  }

  async updateUserSettings(userId: number, updateData: Partial<UserSettings>): Promise<UserSettings> {
    let settings = await this.getUserSettings(userId);
    
    if (!settings) {
      const id = this.currentSettingsId++;
      settings = {
        id,
        userId,
        theme: 'dark',
        notifications: true,
        reminderTime: null,
        ...updateData
      };
    } else {
      settings = { ...settings, ...updateData };
    }
    
    this.userSettings.set(settings.id, settings);
    return settings;
  }

  async getUserStats(userId: number): Promise<{
    totalSolved: number;
    todaysSolved: number;
    currentStreak: number;
    difficultyCounts: { easy: number; medium: number; hard: number };
    patternCounts: Record<string, number>;
    weeklyActivity: Array<{ date: string; count: number }>;
  }> {
    const problems = await this.getProblems(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysSolved = problems.filter(p => {
      const solvedDate = new Date(p.solvedAt);
      solvedDate.setHours(0, 0, 0, 0);
      return solvedDate.getTime() === today.getTime();
    }).length;

    const difficultyCounts = problems.reduce((acc, p) => {
      if (p.difficulty === 'Easy') acc.easy++;
      else if (p.difficulty === 'Medium') acc.medium++;
      else if (p.difficulty === 'Hard') acc.hard++;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });

    const patternCounts = problems.reduce((acc, p) => {
      if (p.pattern) {
        acc[p.pattern] = (acc[p.pattern] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate streak
    let currentStreak = 0;
    const sortedProblems = problems
      .sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime());
    
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    while (true) {
      const dayProblems = sortedProblems.filter(p => {
        const solvedDate = new Date(p.solvedAt);
        solvedDate.setHours(0, 0, 0, 0);
        return solvedDate.getTime() === currentDate.getTime();
      });
      
      if (dayProblems.length > 0) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (currentStreak === 0 && currentDate.getTime() === today.getTime()) {
        // No problems today, but continue checking yesterday
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Weekly activity for last 7 days
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const count = problems.filter(p => {
        const solvedDate = new Date(p.solvedAt);
        solvedDate.setHours(0, 0, 0, 0);
        return solvedDate.getTime() === date.getTime();
      }).length;
      
      weeklyActivity.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    return {
      totalSolved: problems.length,
      todaysSolved,
      currentStreak,
      difficultyCounts,
      patternCounts,
      weeklyActivity
    };
  }
}

export const storage = new MemStorage();

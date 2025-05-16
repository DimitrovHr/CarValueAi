import {
  users,
  carValuations,
  subscriptions,
  type User,
  type InsertUser,
  type CarValuation,
  type InsertCarValuation,
  type Subscription,
  type InsertSubscription
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; // For backwards compatibility
  createUser(user: InsertUser): Promise<User>;
  
  // Car valuation operations
  getCarValuation(id: number): Promise<CarValuation | undefined>;
  getUserCarValuations(userId: number): Promise<CarValuation[]>;
  createCarValuation(valuation: InsertCarValuation): Promise<CarValuation>;
  
  // Subscription operations
  getSubscription(id: number): Promise<Subscription | undefined>;
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // For backwards compatibility
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Car valuation operations
  async getCarValuation(id: number): Promise<CarValuation | undefined> {
    const [valuation] = await db.select().from(carValuations).where(eq(carValuations.id, id));
    return valuation;
  }
  
  async getUserCarValuations(userId: number): Promise<CarValuation[]> {
    return db.select().from(carValuations).where(eq(carValuations.userId, userId));
  }
  
  async createCarValuation(valuation: InsertCarValuation): Promise<CarValuation> {
    const [newValuation] = await db
      .insert(carValuations)
      .values(valuation)
      .returning();
    return newValuation;
  }
  
  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }
  
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    const results = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    
    // Sort by created date manually instead of using orderBy
    if (results.length > 0) {
      results.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return results[0];
    }
    
    return undefined;
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }
}

export const storage = new DatabaseStorage();

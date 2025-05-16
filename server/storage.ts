import {
  users,
  carValuations,
  payments,
  businessSubscriptions,
  inquiries,
  type User,
  type InsertUser,
  type CarValuation,
  type InsertCarValuation,
  type Payment,
  type InsertPayment,
  type BusinessSubscription,
  type InsertBusinessSubscription,
  type Inquiry,
  type InsertInquiry
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; // For backwards compatibility
  getUserByApiKey(apiKey: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  generateApiKey(userId: number): Promise<string>;
  
  // Car valuation operations
  getCarValuation(id: number): Promise<CarValuation | undefined>;
  getUserCarValuations(userId: number): Promise<CarValuation[]>;
  createCarValuation(valuation: InsertCarValuation): Promise<CarValuation>;
  updateCarValuation(id: number, valuation: Partial<CarValuation>): Promise<CarValuation>;
  getAllCarValuations(limit?: number): Promise<CarValuation[]>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: number): Promise<Payment | undefined>;
  getUserPayments(userId: number): Promise<Payment[]>;
  updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment>;
  getAllPayments(limit?: number): Promise<Payment[]>;
  
  // Business subscription operations
  createBusinessSubscription(subscription: InsertBusinessSubscription): Promise<BusinessSubscription>;
  getBusinessSubscription(id: number): Promise<BusinessSubscription | undefined>;
  getUserBusinessSubscription(userId: number): Promise<BusinessSubscription | undefined>;
  updateBusinessSubscription(id: number, subscriptionData: Partial<BusinessSubscription>): Promise<BusinessSubscription>;
  
  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getAllInquiries(limit?: number): Promise<Inquiry[]>;
  updateInquiry(id: number, inquiryData: Partial<Inquiry>): Promise<Inquiry>;
  
  // Admin operations
  getDashboardStats(): Promise<{
    totalUsers: number;
    totalValuations: number;
    totalPayments: number;
    totalInquiries: number;
    revenueToday: number;
    revenueThisMonth: number;
  }>;
}

// Implementation of the storage interface using database storage
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
  
  async getUserByApiKey(apiKey: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.apiKey, apiKey));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }
  
  async generateApiKey(userId: number): Promise<string> {
    const apiKey = `cva_${uuidv4().replace(/-/g, '')}`;
    await this.updateUser(userId, { apiKey });
    return apiKey;
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
  
  async updateCarValuation(id: number, valuation: Partial<CarValuation>): Promise<CarValuation> {
    const [updatedValuation] = await db
      .update(carValuations)
      .set(valuation)
      .where(eq(carValuations.id, id))
      .returning();
    return updatedValuation;
  }
  
  async getAllCarValuations(limit: number = 100): Promise<CarValuation[]> {
    return db.select().from(carValuations).orderBy(desc(carValuations.createdAt)).limit(limit);
  }
  
  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return newPayment;
  }
  
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }
  
  async getUserPayments(userId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId));
  }
  
  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set(paymentData)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }
  
  async getAllPayments(limit: number = 100): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt)).limit(limit);
  }
  
  // Business subscription operations
  async createBusinessSubscription(subscription: InsertBusinessSubscription): Promise<BusinessSubscription> {
    const [newSubscription] = await db
      .insert(businessSubscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }
  
  async getBusinessSubscription(id: number): Promise<BusinessSubscription | undefined> {
    const [subscription] = await db.select().from(businessSubscriptions).where(eq(businessSubscriptions.id, id));
    return subscription;
  }
  
  async getUserBusinessSubscription(userId: number): Promise<BusinessSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(businessSubscriptions)
      .where(and(
        eq(businessSubscriptions.userId, userId),
        eq(businessSubscriptions.status, 'active')
      ));
    return subscription;
  }
  
  async updateBusinessSubscription(id: number, subscriptionData: Partial<BusinessSubscription>): Promise<BusinessSubscription> {
    const [updatedSubscription] = await db
      .update(businessSubscriptions)
      .set({
        ...subscriptionData,
        updatedAt: new Date()
      })
      .where(eq(businessSubscriptions.id, id))
      .returning();
    return updatedSubscription;
  }
  
  // Inquiry operations
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db
      .insert(inquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }
  
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }
  
  async getAllInquiries(limit: number = 100): Promise<Inquiry[]> {
    return db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(limit);
  }
  
  async updateInquiry(id: number, inquiryData: Partial<Inquiry>): Promise<Inquiry> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set(inquiryData)
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }
  
  // Admin dashboard stats
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalValuations: number;
    totalPayments: number;
    totalInquiries: number;
    revenueToday: number;
    revenueThisMonth: number;
  }> {
    // Count total users
    const [userResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalUsers = Number(userResult?.count || 0);
      
    // Count total valuations
    const [valuationResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(carValuations);
    const totalValuations = Number(valuationResult?.count || 0);
      
    // Count total payments
    const [paymentResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments);
    const totalPayments = Number(paymentResult?.count || 0);
      
    // Count total inquiries
    const [inquiryResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries);
    const totalInquiries = Number(inquiryResult?.count || 0);
    
    // Calculate today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [todayResult] = await db
      .select({ sum: sql<string>`coalesce(sum(amount), 0)` })
      .from(payments)
      .where(and(
        sql`payment_date >= ${today}`,
        eq(payments.status, 'completed')
      ));
    const revenueToday = Number(todayResult?.sum || 0);
    
    // Calculate this month's revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const [monthResult] = await db
      .select({ sum: sql<string>`coalesce(sum(amount), 0)` })
      .from(payments)
      .where(and(
        sql`payment_date >= ${startOfMonth}`,
        eq(payments.status, 'completed')
      ));
    const revenueThisMonth = Number(monthResult?.sum || 0);
    
    return {
      totalUsers,
      totalValuations,
      totalPayments,
      totalInquiries,
      revenueToday,
      revenueThisMonth
    };
  }
}

export const storage = new DatabaseStorage();

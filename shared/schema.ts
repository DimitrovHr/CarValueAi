import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  role: text("role").default("user"), // user, admin
  plan: text("plan").default("free"), // free, regular, premium, business
  apiKey: text("api_key").unique(),
  usageLimit: integer("usage_limit"), // For business clients: number of inquiries allowed
  usageCount: integer("usage_count").default(0), // Number of inquiries used
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
});

// Car Valuations table
export const carValuations = pgTable("car_valuations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clientEmail: text("client_email"), // Added for business clients who submit valuations for their customers
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  vin: text("vin"), // Vehicle Identification Number (optional but helps with more precise valuations)
  condition: text("condition").notNull(), // excellent, very-good, good, fair, poor
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  confidence: decimal("confidence", { precision: 4, scale: 2 }), // 0.00 - 1.00
  marketTrend: text("market_trend"), // rising, stable, declining
  createdAt: timestamp("created_at").defaultNow(),
  reportData: json("report_data"),
  status: text("status").default("pending"), // pending, completed, failed
  isPaid: boolean("is_paid").default(false),
  requestSource: text("request_source").default("web"), // web, api
});

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  valuationId: integer("valuation_id").references(() => carValuations.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("EUR"),
  status: text("status").default("pending"), // pending, completed, failed, refunded
  paymentMethod: text("payment_method"),
  paymentDate: timestamp("payment_date"),
  createdAt: timestamp("created_at").defaultNow(),
  transactionId: text("transaction_id"),
  invoiceNumber: text("invoice_number"),
});

// Business Subscriptions table (only for business clients)
export const businessSubscriptions = pgTable("business_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  plan: text("plan").notNull(), // small, medium, large, enterprise
  monthlyQuota: integer("monthly_quota").notNull(), // Number of valuations included per month
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: text("status").default("active"), // active, cancelled, expired
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: text("currency").default("EUR"),
  paymentFrequency: text("payment_frequency").default("monthly"), // monthly, yearly
  autoRenew: boolean("auto_renew").default(true),
});

// Inquiries table (for contact form submissions)
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status").default("unread"), // unread, read, replied, archived
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
  plan: true,
  apiKey: true,
  usageLimit: true,
});

export const insertCarValuationSchema = createInsertSchema(carValuations).pick({
  userId: true,
  clientEmail: true,
  make: true,
  model: true,
  year: true,
  mileage: true,
  condition: true,
  requestSource: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  valuationId: true,
  amount: true,
  currency: true,
  paymentMethod: true,
});

export const insertBusinessSubscriptionSchema = createInsertSchema(businessSubscriptions).pick({
  userId: true,
  plan: true,
  monthlyQuota: true,
  endDate: true,
  amount: true,
  currency: true,
  paymentFrequency: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCarValuation = z.infer<typeof insertCarValuationSchema>;
export type CarValuation = typeof carValuations.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertBusinessSubscription = z.infer<typeof insertBusinessSubscriptionSchema>;
export type BusinessSubscription = typeof businessSubscriptions.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

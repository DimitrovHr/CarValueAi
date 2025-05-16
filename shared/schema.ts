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
  plan: text("plan").default("free"), // free, regular, premium, business
  subscriptionStatus: text("subscription_status").default("inactive"), // active, inactive, trial
  trialEndsAt: timestamp("trial_ends_at"),
});

// Car Valuations table
export const carValuations = pgTable("car_valuations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  condition: text("condition").notNull(), // excellent, very-good, good, fair, poor
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  confidence: decimal("confidence", { precision: 4, scale: 2 }), // 0.00 - 1.00
  marketTrend: text("market_trend"), // rising, stable, declining
  createdAt: timestamp("created_at").defaultNow(),
  reportData: json("report_data"),
  status: text("status").default("pending"), // pending, completed, failed
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  planId: text("plan_id").notNull(), // regular, premium, business
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: text("status").default("active"), // active, cancelled, expired
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  paymentMethod: text("payment_method"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: text("currency").default("EUR"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  plan: true,
  subscriptionStatus: true,
});

export const insertCarValuationSchema = createInsertSchema(carValuations).pick({
  userId: true,
  make: true,
  model: true,
  year: true,
  mileage: true,
  condition: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  planId: true,
  endDate: true,
  paymentMethod: true,
  amount: true,
  currency: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCarValuation = z.infer<typeof insertCarValuationSchema>;
export type CarValuation = typeof carValuations.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarValuationSchema, insertUserSchema, insertBusinessSubscriptionSchema, insertPaymentSchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { hashPassword, comparePassword } from "./auth";

// Helper function to generate a car valuation (simulated for now)
async function generateCarValuation(make: string, model: string, year: number, mileage: number, condition: string) {
  // Base price calculations based on make/model
  const basePriceMap: Record<string, number> = {
    "audi": 15000,
    "bmw": 17000,
    "mercedes": 18000,
    "volkswagen": 12000,
    "toyota": 13000,
    "other": 10000
  };
  
  // Calculate age factor (newer cars are worth more)
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  const ageFactor = Math.max(0.5, 1 - (age * 0.05)); // Lose 5% per year, minimum 50% of value
  
  // Mileage impact (higher mileage lowers value)
  const mileageFactor = Math.max(0.5, 1 - (mileage / 300000)); // Up to 50% reduction for high mileage
  
  // Condition impact
  const conditionFactors: Record<string, number> = {
    "excellent": 1.2,
    "very-good": 1.1,
    "good": 1.0,
    "fair": 0.85,
    "poor": 0.7
  };
  
  // Base price from the make
  const basePrice = basePriceMap[make.toLowerCase()] || basePriceMap.other;
  
  // Calculate final price
  const estimatedValue = Math.round(basePrice * ageFactor * mileageFactor * conditionFactors[condition]);
  
  // Determine market trend based on make and age
  let marketTrend = "stable";
  if (age < 3) {
    marketTrend = "declining"; // Newer cars typically depreciate faster
  } else if (make.toLowerCase() === "toyota" || make.toLowerCase() === "volkswagen") {
    marketTrend = "rising"; // Some brands hold value better in the Bulgarian market
  }
  
  // Generate confidence score
  const confidence = Math.min(0.95, Math.max(0.6, 0.9 - (age * 0.01) - (mileage/500000)));
  
  // Add random factor to make it less predictable
  const randomFactor = 0.9 + (Math.random() * 0.2); // Between 0.9 and 1.1
  const finalValue = Math.round(estimatedValue * randomFactor);
  
  // Create price range (15% below and above)
  const minPrice = Math.round(finalValue * 0.85);
  const maxPrice = Math.round(finalValue * 1.15);
  
  return {
    estimatedValue: finalValue,
    confidence: parseFloat(confidence.toFixed(2)),
    marketTrend,
    reportData: {
      estimatedValue: finalValue,
      priceRange: {
        min: minPrice,
        max: maxPrice
      },
      confidence: parseFloat(confidence.toFixed(2)),
      marketTrend,
      analysis: `This ${year} ${make} ${model} with ${mileage}km in ${condition} condition is valued at approximately €${finalValue}. The value could range between €${minPrice} and €${maxPrice} depending on specific factors like exact trim level, service history, and local market conditions.`,
      comparableListings: [
        {
          year: year - 1,
          make,
          model,
          mileage: mileage - 15000,
          price: finalValue + 2000,
          source: "mobile.bg"
        },
        {
          year,
          make,
          model,
          mileage: mileage + 20000,
          price: finalValue - 1500,
          source: "cars.bg"
        },
        {
          year: year + 1,
          make,
          model,
          mileage: mileage - 30000,
          price: finalValue + 4000,
          source: "Facebook Marketplace"
        }
      ],
      marketDemand: Math.floor(Math.random() * 5) + 5, // Random 5-10 rating
      insights: [
        "Bulgarian buyers typically prioritize fuel efficiency and lower maintenance costs.",
        "Diesel engines remain popular in the Bulgarian market despite European trends.",
        "Models with good parts availability and service network command premium prices.",
        "Cars with service history from authorized dealers tend to sell faster."
      ]
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await hashPassword(userData.password);
      
      // Add 60-day trial
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 60);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: "user",
        plan: "free", // Default plan
        isActive: true
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
      }
    }
  });
  
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const passwordMatch = await comparePassword(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Create session (in a real app, would use JWT or session cookie)
      // For simplicity, just returning the user without password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });
  
  // Car valuation routes
  app.post('/api/valuations', async (req, res) => {
    try {
      const valuationData = insertCarValuationSchema.parse(req.body);
      
      // Generate valuation for the car
      const carValuation = await generateCarValuation(
        valuationData.make,
        valuationData.model,
        Number(valuationData.year),
        Number(valuationData.mileage),
        valuationData.condition
      );
      
      // Combine the user input with valuation
      const fullValuationData = {
        ...valuationData,
        estimatedValue: carValuation.estimatedValue,
        confidence: carValuation.confidence,
        marketTrend: carValuation.marketTrend,
        reportData: carValuation.reportData,
        status: "completed"
      };
      
      const valuation = await storage.createCarValuation(fullValuationData);
      
      res.status(201).json(valuation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Valuation creation error:", error);
        res.status(500).json({ error: "Failed to create valuation" });
      }
    }
  });
  
  app.get('/api/valuations/:id', async (req, res) => {
    try {
      const valuation = await storage.getCarValuation(Number(req.params.id));
      
      if (!valuation) {
        return res.status(404).json({ error: "Valuation not found" });
      }
      
      res.json(valuation);
    } catch (error) {
      console.error("Get valuation error:", error);
      res.status(500).json({ error: "Failed to retrieve valuation" });
    }
  });
  
  app.get('/api/users/:userId/valuations', async (req, res) => {
    try {
      const valuations = await storage.getUserCarValuations(Number(req.params.userId));
      res.json(valuations);
    } catch (error) {
      console.error("Get user valuations error:", error);
      res.status(500).json({ error: "Failed to retrieve user valuations" });
    }
  });
  
  // Subscription routes
  app.post('/api/subscriptions', async (req, res) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse(req.body);
      
      // Calculate end date based on plan type if not provided
      if (!subscriptionData.endDate) {
        const endDate = new Date();
        
        if (subscriptionData.planId === "regular") {
          endDate.setDate(endDate.getDate() + 7); // 1 week for regular
        } else if (subscriptionData.planId === "premium") {
          endDate.setMonth(endDate.getMonth() + 1); // 1 month for premium
        } else if (subscriptionData.planId === "business") {
          endDate.setMonth(endDate.getMonth() + 1); // 1 month for business
        }
        
        subscriptionData.endDate = endDate;
      }
      
      const subscription = await storage.createSubscription(subscriptionData);
      
      // Update user plan information if user ID is provided
      if (subscriptionData.userId) {
        const user = await storage.getUser(subscriptionData.userId);
        // In a real app, would update the user's plan information here
      }
      
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Subscription creation error:", error);
        res.status(500).json({ error: "Failed to create subscription" });
      }
    }
  });
  
  app.get('/api/users/:userId/subscription', async (req, res) => {
    try {
      const subscription = await storage.getUserSubscription(Number(req.params.userId));
      
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      res.json(subscription);
    } catch (error) {
      console.error("Get subscription error:", error);
      res.status(500).json({ error: "Failed to retrieve subscription" });
    }
  });

  // Simple public valuation endpoint for the home page demo
  app.post('/api/quick-valuation', async (req, res) => {
    try {
      const { make, model, year, mileage, condition } = req.body;
      
      if (!make || !model || !year || !mileage || !condition) {
        return res.status(400).json({ error: "All car details are required" });
      }
      
      // Generate valuation
      const carValuation = await generateCarValuation(
        make,
        model,
        Number(year),
        Number(mileage),
        condition
      );
      
      res.json({
        estimatedValue: carValuation.estimatedValue,
        confidence: carValuation.confidence,
        marketTrend: carValuation.marketTrend,
        summary: carValuation.reportData.analysis || "Car valuation analysis completed"
      });
    } catch (error) {
      console.error("Quick valuation error:", error);
      res.status(500).json({ error: "Failed to generate quick valuation" });
    }
  });

  // Return an HTTP server based on the Express app
  const httpServer = createServer(app);
  return httpServer;
}
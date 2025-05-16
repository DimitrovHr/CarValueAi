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
        plan: "free" // Default plan
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
  
  // Business Subscription routes
  app.post('/api/business-subscriptions', async (req, res) => {
    try {
      const subscriptionData = insertBusinessSubscriptionSchema.parse(req.body);
      
      // Calculate end date based on payment frequency if not provided
      if (!subscriptionData.endDate) {
        const endDate = new Date();
        
        if (subscriptionData.paymentFrequency === "monthly") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (subscriptionData.paymentFrequency === "yearly") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          // Default to monthly
          endDate.setMonth(endDate.getMonth() + 1);
        }
        
        subscriptionData.endDate = endDate;
      }
      
      const subscription = await storage.createBusinessSubscription(subscriptionData);
      
      // Update user plan information
      if (subscriptionData.userId) {
        await storage.updateUser(subscriptionData.userId, {
          plan: "business"
        });
      }
      
      res.status(201).json(subscription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Business subscription creation error:", error);
        res.status(500).json({ error: "Failed to create business subscription" });
      }
    }
  });
  
  app.get('/api/users/:userId/business-subscription', async (req, res) => {
    try {
      const subscription = await storage.getUserBusinessSubscription(Number(req.params.userId));
      
      if (!subscription) {
        return res.status(404).json({ error: "Business subscription not found" });
      }
      
      res.json(subscription);
    } catch (error) {
      console.error("Get business subscription error:", error);
      res.status(500).json({ error: "Failed to retrieve business subscription" });
    }
  });
  
  // Payment routes
  app.post('/api/payments', async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      
      // Create a payment
      const paymentWithDate = {
        ...paymentData,
        // We'll handle paymentDate in the storage layer
      };
      
      const payment = await storage.createPayment(paymentWithDate);
      
      // If this payment is for a valuation, mark it as paid
      if (payment.valuationId) {
        await storage.updateCarValuation(payment.valuationId, {
          isPaid: true
        });
      }
      
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Payment creation error:", error);
        res.status(500).json({ error: "Failed to create payment" });
      }
    }
  });
  
  app.get('/api/users/:userId/payments', async (req, res) => {
    try {
      const payments = await storage.getUserPayments(Number(req.params.userId));
      res.json(payments);
    } catch (error) {
      console.error("Get user payments error:", error);
      res.status(500).json({ error: "Failed to retrieve user payments" });
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
  
  // Admin routes - protected with admin role check middleware
  // Simplified admin check for demo purposes
  const isAdmin = async (req: Request, res: Response, next: Function) => {
    // For demo purposes, we'll allow all admin requests
    // In a real app, this would verify the user is an admin
    next();
  };
  
  // Admin Dashboard Stats
  app.get('/api/admin/dashboard', isAdmin, async (req, res) => {
    try {
      // For demo purposes, we'll return mock stats
      // In a production app, this would use storage.getDashboardStats()
      const stats = {
        totalUsers: 5,
        totalValuations: 12,
        totalPayments: 8,
        totalInquiries: 3,
        revenueToday: 44.97,
        revenueThisMonth: 349.85
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Failed to retrieve dashboard stats" });
    }
  });
  
  // Admin User Management
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      // For demo purposes, we'll return mock users
      const mockUsers = [
        {
          id: 1,
          username: "admin",
          email: "admin@carvalueai.com",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          plan: "business",
          apiKey: "cva_1a2b3c4d5e6f7g8h9i0j",
          usageLimit: 1000,
          usageCount: 45,
          isActive: true,
          createdAt: new Date('2023-01-15').toISOString(),
          lastLoginAt: new Date().toISOString()
        },
        {
          id: 2,
          username: "ivan",
          email: "ivan@example.com",
          firstName: "Ivan",
          lastName: "Petrov",
          role: "user",
          plan: "premium",
          apiKey: null,
          usageLimit: null,
          usageCount: 0,
          isActive: true,
          createdAt: new Date('2023-03-22').toISOString(),
          lastLoginAt: new Date('2023-05-10').toISOString()
        },
        {
          id: 3,
          username: "dealer",
          email: "dealer@cardealership.bg",
          firstName: "Auto",
          lastName: "Dealer",
          role: "user",
          plan: "business",
          apiKey: "cva_9i8h7g6f5e4d3c2b1a0",
          usageLimit: 500,
          usageCount: 327,
          isActive: true,
          createdAt: new Date('2023-02-10').toISOString(),
          lastLoginAt: new Date('2023-05-12').toISOString()
        }
      ];
      
      res.json(mockUsers);
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  });
  
  app.patch('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;
      
      // Make sure we don't try to update password through this endpoint
      if (userData.password) {
        delete userData.password;
      }
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });
  
  // API Key Generation for Business Clients
  app.post('/api/admin/users/:id/generate-api-key', isAdmin, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const apiKey = await storage.generateApiKey(userId);
      
      res.json({ apiKey });
    } catch (error) {
      console.error("API key generation error:", error);
      res.status(500).json({ error: "Failed to generate API key" });
    }
  });
  
  // Admin Inquiry Management
  app.get('/api/admin/inquiries', isAdmin, async (req, res) => {
    try {
      // For demo purposes, return mock inquiries
      const mockInquiries = [
        {
          id: 1,
          name: "Ivan Petrov",
          email: "ivan@example.com",
          phone: "+359888123456",
          message: "I would like to know more about your business subscription plans. I run a car dealership in Sofia and I need to value multiple cars each month.",
          createdAt: new Date('2023-05-12T10:30:00').toISOString(),
          status: "unread",
          assignedTo: null,
          notes: null
        },
        {
          id: 2,
          name: "Maria Dimitrova",
          email: "maria@example.com",
          phone: "+359877456789",
          message: "I want to sell my car and need an accurate valuation. Do you provide valuations for private sellers?",
          createdAt: new Date('2023-05-11T14:22:00').toISOString(),
          status: "read",
          assignedTo: 1,
          notes: "Responded via email about our regular plan"
        },
        {
          id: 3,
          name: "Stefan Georgiev",
          email: "stefan@example.com",
          phone: "+359899789123",
          message: "I am interested in your API for our automobile website. Can you provide pricing for 50 valuations per day?",
          createdAt: new Date('2023-05-10T09:15:00').toISOString(),
          status: "replied",
          assignedTo: 1,
          notes: "Sent business plan proposal with API documentation"
        }
      ];
      
      res.json(mockInquiries);
    } catch (error) {
      console.error("Get all inquiries error:", error);
      res.status(500).json({ error: "Failed to retrieve inquiries" });
    }
  });
  
  app.patch('/api/admin/inquiries/:id', isAdmin, async (req, res) => {
    try {
      const inquiryId = Number(req.params.id);
      const inquiryData = req.body;
      
      const updatedInquiry = await storage.updateInquiry(inquiryId, inquiryData);
      
      res.json(updatedInquiry);
    } catch (error) {
      console.error("Update inquiry error:", error);
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });
  
  // Admin Valuation Management
  app.get('/api/admin/valuations', isAdmin, async (req, res) => {
    try {
      // For demo purposes, return mock valuations
      const mockValuations = [
        {
          id: 1,
          userId: 2,
          clientEmail: null,
          make: "BMW",
          model: "530i",
          year: 2019,
          mileage: 85000,
          condition: "good",
          estimatedValue: "28500.00",
          confidence: "0.85",
          marketTrend: "stable",
          createdAt: new Date('2023-05-12T10:45:00').toISOString(),
          status: "completed",
          isPaid: true,
          requestSource: "web"
        },
        {
          id: 2,
          userId: 3,
          clientEmail: "client@example.com",
          make: "Audi",
          model: "A4",
          year: 2018,
          mileage: 95000,
          condition: "very-good",
          estimatedValue: "22800.00",
          confidence: "0.82",
          marketTrend: "rising",
          createdAt: new Date('2023-05-11T16:30:00').toISOString(),
          status: "completed",
          isPaid: true,
          requestSource: "api"
        },
        {
          id: 3,
          userId: 3,
          clientEmail: "another@example.com",
          make: "Mercedes",
          model: "C200",
          year: 2020,
          mileage: 45000,
          condition: "excellent",
          estimatedValue: "32500.00",
          confidence: "0.90",
          marketTrend: "stable",
          createdAt: new Date('2023-05-10T14:15:00').toISOString(),
          status: "completed",
          isPaid: true,
          requestSource: "api"
        },
        {
          id: 4,
          userId: null,
          clientEmail: null,
          make: "Volkswagen",
          model: "Golf",
          year: 2017,
          mileage: 110000,
          condition: "fair",
          estimatedValue: "14800.00",
          confidence: "0.78",
          marketTrend: "declining",
          createdAt: new Date('2023-05-13T09:10:00').toISOString(),
          status: "completed",
          isPaid: false,
          requestSource: "web"
        }
      ];
      
      res.json(mockValuations);
    } catch (error) {
      console.error("Get all valuations error:", error);
      res.status(500).json({ error: "Failed to retrieve valuations" });
    }
  });
  
  // Admin Payment Management
  app.get('/api/admin/payments', isAdmin, async (req, res) => {
    try {
      // For demo purposes, return mock payments
      const mockPayments = [
        {
          id: 1,
          userId: 2,
          valuationId: 1,
          amount: "14.99",
          currency: "EUR",
          status: "completed",
          paymentMethod: "credit_card",
          paymentDate: new Date('2023-05-12T11:30:00').toISOString(),
          createdAt: new Date('2023-05-12T11:30:00').toISOString(),
          transactionId: "txn_1234567890",
          invoiceNumber: "INV-2023-001"
        },
        {
          id: 2,
          userId: 3,
          valuationId: 2,
          amount: "29.99",
          currency: "EUR",
          status: "completed",
          paymentMethod: "paypal",
          paymentDate: new Date('2023-05-11T17:00:00').toISOString(),
          createdAt: new Date('2023-05-11T17:00:00').toISOString(),
          transactionId: "txn_0987654321",
          invoiceNumber: "INV-2023-002"
        },
        {
          id: 3,
          userId: 3,
          valuationId: 3,
          amount: "29.99",
          currency: "EUR",
          status: "completed",
          paymentMethod: "credit_card",
          paymentDate: new Date('2023-05-10T15:00:00').toISOString(),
          createdAt: new Date('2023-05-10T15:00:00').toISOString(),
          transactionId: "txn_1122334455",
          invoiceNumber: "INV-2023-003"
        },
        {
          id: 4,
          userId: 2,
          valuationId: null,
          amount: "14.99",
          currency: "EUR",
          status: "pending",
          paymentMethod: "bank_transfer",
          paymentDate: null,
          createdAt: new Date('2023-05-13T10:00:00').toISOString(),
          transactionId: null,
          invoiceNumber: "INV-2023-004"
        }
      ];
      
      res.json(mockPayments);
    } catch (error) {
      console.error("Get all payments error:", error);
      res.status(500).json({ error: "Failed to retrieve payments" });
    }
  });
  
  // Inquiry creation endpoint (from contact form)
  app.post('/api/inquiries', async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      
      const inquiry = await storage.createInquiry(inquiryData);
      
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Inquiry creation error:", error);
        res.status(500).json({ error: "Failed to create inquiry" });
      }
    }
  });

  // Return an HTTP server based on the Express app
  const httpServer = createServer(app);
  return httpServer;
}
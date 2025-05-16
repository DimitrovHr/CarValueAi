import { db } from '../../server/db-serverless';
import { users } from '../../shared/schema';
import { desc } from 'drizzle-orm';

export default async function handler(req, res) {
  // Check request method
  if (req.method === 'GET') {
    try {
      // For demo purposes, we'll return mock users
      // In a production app, this would use: await db.select().from(users).orderBy(desc(users.createdAt));
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
      
      return res.status(200).json(mockUsers);
    } catch (error) {
      console.error("Get all users error:", error);
      return res.status(500).json({ error: "Failed to retrieve users" });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
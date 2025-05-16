import { db } from '../server/db-serverless';
import { users } from '../shared/schema';
import { hashPassword } from '../server/auth';
import { z } from 'zod';

// Schema for validating user registration data
const registerSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate the request data
    const validData = registerSchema.parse(req.body);
    
    // Hash the password
    const hashedPassword = await hashPassword(validData.password);
    
    // Add 60-day trial
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 60);
    
    // Insert the user into the database
    const [user] = await db.insert(users)
      .values({
        ...validData,
        password: hashedPassword,
        role: "user",
        plan: "free" // Default plan
      })
      .returning();
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Failed to register user" });
    }
  }
}
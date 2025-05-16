// Import auth helpers
import { comparePassword } from '../server/auth';
import { db } from '../server/db-serverless';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Compare password
    const passwordMatch = await comparePassword(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Create session (in a real app, would use JWT or session cookie)
    // For simplicity, just returning the user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Failed to log in" });
  }
}
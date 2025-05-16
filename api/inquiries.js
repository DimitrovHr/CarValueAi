import { db } from '../server/db-serverless';
import { inquiries } from '../shared/schema';
import { z } from 'zod';

// Schema for validating inquiry data
const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required")
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate the request data
    const validData = inquirySchema.parse(req.body);
    
    // Insert the inquiry into the database
    const [inquiry] = await db.insert(inquiries)
      .values(validData)
      .returning();
    
    return res.status(201).json(inquiry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    } else {
      console.error("Inquiry creation error:", error);
      return res.status(500).json({ error: "Failed to create inquiry" });
    }
  }
}
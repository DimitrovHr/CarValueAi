export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For demo purposes, return mock inquiries
    const mockInquiries = [
      {
        id: 1,
        name: "Maria Ivanova",
        email: "maria.ivanova@example.com",
        phone: "+359 888 123 456",
        message: "I'm interested in a business subscription for my car dealership. Could you provide more information about pricing and features?",
        createdAt: new Date('2023-05-13T14:25:00').toISOString(),
        status: "read",
        assignedTo: 1,
        notes: "Sent business plan details via email"
      },
      {
        id: 2,
        name: "Georgi Dimitrov",
        email: "gdimitrov@example.com",
        phone: null,
        message: "I recently used your valuation service but I think the price estimate was too low for my BMW. Can you explain how you calculate the values?",
        createdAt: new Date('2023-05-12T09:15:00').toISOString(),
        status: "replied",
        assignedTo: 1,
        notes: "Explained valuation methodology and offered a discount on the next valuation"
      },
      {
        id: 3,
        name: "Stoyan Petrov",
        email: "stoyan@example.com",
        phone: "+359 877 987 654",
        message: "Hello, I'm having trouble with my account login. Can you help?",
        createdAt: new Date('2023-05-11T17:40:00').toISOString(),
        status: "unread",
        assignedTo: null,
        notes: null
      }
    ];
    
    return res.status(200).json(mockInquiries);
  } catch (error) {
    console.error("Get all inquiries error:", error);
    return res.status(500).json({ error: "Failed to retrieve inquiries" });
  }
}
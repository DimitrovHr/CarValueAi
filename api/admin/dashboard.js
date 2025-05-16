export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For demo purposes, we'll return mock stats
    // In a production app, this would query the database for real statistics
    const stats = {
      totalUsers: 5,
      totalValuations: 12,
      totalPayments: 8,
      totalInquiries: 3,
      revenueToday: 44.97,
      revenueThisMonth: 349.85
    };
    
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ error: "Failed to retrieve dashboard stats" });
  }
}
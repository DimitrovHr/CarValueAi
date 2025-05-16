export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
        vin: "WBAJA5C52KBW51974",
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
        vin: "WAUZZZ8K7JA123456",
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
        vin: null,
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
        vin: "WVWZZZ1KZAM654321",
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
    
    return res.status(200).json(mockValuations);
  } catch (error) {
    console.error("Get all valuations error:", error);
    return res.status(500).json({ error: "Failed to retrieve valuations" });
  }
}
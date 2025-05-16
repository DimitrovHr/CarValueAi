export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    return res.status(200).json(mockPayments);
  } catch (error) {
    console.error("Get all payments error:", error);
    return res.status(500).json({ error: "Failed to retrieve payments" });
  }
}
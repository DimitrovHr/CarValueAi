// Import required dependencies
import { generateCarValuation } from '../server/valuation-helpers';

// Serverless function for quick car valuation
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { make, model, year, mileage, condition, vin } = req.body;
    
    // Validate required fields
    if (!make || !model || !year || !mileage || !condition) {
      return res.status(400).json({ error: "All car details are required" });
    }
    
    // Generate valuation with the optional VIN
    const carValuation = await generateCarValuation(
      make,
      model,
      Number(year),
      Number(mileage),
      condition,
      vin
    );
    
    // Return the valuation result
    return res.status(200).json({
      estimatedValue: carValuation.estimatedValue,
      confidence: carValuation.confidence,
      marketTrend: carValuation.marketTrend,
      summary: carValuation.reportData?.analysis || "Car valuation analysis completed"
    });
  } catch (error) {
    console.error("Quick valuation error:", error);
    return res.status(500).json({ error: "Failed to generate quick valuation" });
  }
}
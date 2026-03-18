// Vercel serverless function to complete order
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;
    
    console.log('Completing order for session:', sessionId);
    
    // In a real implementation, you would:
    // 1. Verify the session with Stripe
    // 2. Update order status in database
    // 3. Send confirmation emails
    
    // For now, just return success
    res.status(200).json({ success: true, message: 'Order completed' });

  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ error: error.message });
  }
}

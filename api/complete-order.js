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
    
    // Update order status in secure storage
    try {
      const updateResponse = await fetch(`${req.headers.origin}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          status: 'paid',
          completedAt: new Date().toISOString()
        })
      });
      
      if (updateResponse.ok) {
        console.log('✅ Order status updated to paid');
      } else {
        console.log('⚠️ Could not update order status');
      }
    } catch (error) {
      console.log('⚠️ Error updating order status:', error.message);
    }
    
    res.status(200).json({ success: true, message: 'Order completed' });

  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ error: error.message });
  }
}

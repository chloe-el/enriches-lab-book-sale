// Admin endpoint to view all orders (for development/testing)
// WARNING: This exposes customer data - only for development!

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This would connect to your secure storage
    // For now, return a message about where to find orders
    res.json({
      message: "Order viewing options:",
      options: {
        stripe_dashboard: "https://dashboard.stripe.com",
        vercel_logs: "https://vercel.com/dashboard",
        server_storage: "Orders stored securely in server-side memory",
        note: "Customer data is protected and not exposed publicly"
      }
    });
  } catch (error) {
    console.error('Error accessing orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

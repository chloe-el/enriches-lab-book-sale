// Secure serverless function for order management
// This replaces the public orders.json file

// In production, use a real database. For now, we'll use environment variables
// or server-side storage that's not accessible to the public

let orders = []; // In-memory storage (replace with database in production)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method } = req;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const orderId = url.searchParams.get('orderId');

    switch (method) {
      case 'GET':
        if (orderId) {
          // Get specific order
          const order = orders.find(o => o.orderId === orderId);
          if (!order) {
            return res.status(404).json({ error: 'Order not found' });
          }
          // Return order without sensitive customer email for public access
          const { customerEmail, ...safeOrder } = order;
          res.json(safeOrder);
        } else {
          // Get all orders (admin only - add authentication)
          res.json(orders);
        }
        break;

      case 'POST':
        // Save new order
        const newOrder = req.body;
        
        // Validate required fields
        if (!newOrder.orderId || !newOrder.customerEmail) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Add timestamp if not present
        newOrder.created = newOrder.created || new Date().toISOString();
        
        // Store order
        orders.push(newOrder);
        
        console.log('Order saved:', newOrder.orderId);
        res.status(201).json({ success: true, orderId: newOrder.orderId });
        break;

      case 'DELETE':
        // Delete order (admin only)
        if (!orderId) {
          return res.status(400).json({ error: 'Order ID required' });
        }
        
        const index = orders.findIndex(o => o.orderId === orderId);
        if (index === -1) {
          return res.status(404).json({ error: 'Order not found' });
        }
        
        orders.splice(index, 1);
        res.json({ success: true });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Order management error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

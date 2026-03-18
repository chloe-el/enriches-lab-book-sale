// Vercel serverless function to get order details
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51MjYP5BH1RcdRKUXMfDxSUi8nQthtIi44UBoVpgSCxzcNJLGllcDW8Dp5BFaNtkfBFOlt0zV15GYP8ja8IFF8ncw007blabqEj');

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
    // Extract session ID from URL - handle both query param and path
    let sessionId = req.query.sessionId;
    
    // If not in query, try to extract from URL path
    if (!sessionId) {
      const urlParts = req.url.split('/');
      sessionId = urlParts[urlParts.length - 1];
      // Remove any query string
      sessionId = sessionId.split('?')[0];
    }
    
    if (!sessionId || sessionId === 'order') {
      return res.status(400).json({ error: 'Session ID required' });
    }
    
    console.log('Fetching order details for session:', sessionId);
    
    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Extract order details from session metadata and line items
    const orderId = session.metadata?.order_id || 'N/A';
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    
    // Format order data
    const order = {
      orderId: orderId,
      created: session.created,
      status: 'completed',
      pickupLocation: 'Enriches Lab Store, Belmont, CA',
      orderType: 'Pre-order',
      estimatedArrival: 'Late April 2025',
      subtotal: 0,
      tax: 0,
      total: session.amount_total / 100,
      books: []
    };
    
    // Process line items
    lineItems.data.forEach(item => {
      if (item.price_data?.product_data?.metadata?.tax_type === 'sales_tax') {
        order.tax = item.amount_total / 100;
      } else {
        order.subtotal += item.amount_total / 100;
        order.books.push({
          name: item.price_data?.product_data?.name || 'Book',
          quantity: item.quantity,
          price: item.amount_total / 100,
          subtotal: (item.amount_total / 100) / item.quantity
        });
      }
    });
    
    console.log('Order details retrieved:', { orderId, total: order.total, booksCount: order.books.length });
    
    res.status(200).json(order);

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: error.message });
  }
}

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
    
    // Retrieve the Stripe session with expanded line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items']
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Extract order details from session metadata and line items
    const orderId = session.metadata?.order_id || 'N/A';
    const items = session.line_items?.data || [];
    
    // Format order data to match local server exactly
    const order = {
      sessionId: session.id,
      orderId: session.metadata?.order_id || 'N/A',
      customerEmail: session.customer_email,
      subtotal: parseFloat(session.metadata?.subtotal || '0'),
      tax: parseFloat(session.metadata?.tax || '0'),
      total: session.amount_total / 100,
      currency: session.currency,
      status: 'completed',
      created: session.created,
      books: [],
      metadata: session.metadata,
      pickupLocation: 'Enriches Lab Store, Belmont, CA',
      orderType: session.metadata?.order_type || 'pre-order',
      estimatedArrival: session.metadata?.estimated_arrival || 'Late April 2025'
    };
    
    // Process line items using local server logic
    items.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        description: item.description,
        name: item.price_data?.product_data?.name,
        metadata: item.price_data?.product_data?.metadata,
        amount: item.amount_total / 100,
        quantity: item.quantity
      });
      
      // Check if this is a tax line item by looking at the description/name
      const isTaxItem = item.description?.toLowerCase().includes('tax') ||
                        item.price_data?.product_data?.name?.toLowerCase().includes('tax') ||
                        item.price_data?.product_data?.metadata?.tax_type === 'sales_tax';
      
      if (isTaxItem) {
        order.tax = item.amount_total / 100;
        console.log('Found tax item:', item.amount_total / 100);
      } else {
        // Use item.description for book name (like local server)
        const bookName = item.description || item.price_data?.product_data?.name || 'Unknown Book';
        const bookPrice = item.amount_total / 100;
        const bookQuantity = item.quantity || 1;
        const bookSubtotal = bookPrice / bookQuantity;
        
        order.books.push({
          name: bookName,
          quantity: bookQuantity,
          price: bookPrice,
          subtotal: bookSubtotal
        });
        console.log('Added book:', bookName, 'Price:', bookPrice);
      }
    });
    
    console.log('Order details retrieved:', { orderId, total: order.total, booksCount: order.books.length });
    
    res.status(200).json(order);

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: error.message });
  }
}

// Vercel serverless function for Stripe checkout
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51MjYP5BH1RcdRKUXMfDxSUi8nQthtIi44UBoVpgSCxzcNJLGllcDW8Dp5BFaNtkfBFOlt0zV15GYP8ja8IFF8ncw007blabqEj');

module.exports = async (req, res) => {
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
    const { orderId, items, customerEmail } = req.body;

    console.log('Creating checkout session for order:', orderId);
    console.log('Items:', items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${req.headers.origin}/index.html?cancelled=true`,
      customer_email: customerEmail,
      metadata: {
        order_id: orderId
      }
    });

    console.log('Session created:', session.id);
    res.status(200).json({ id: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

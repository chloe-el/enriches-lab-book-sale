// Vercel serverless function for Stripe checkout
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51MjYP5BH1RcdRKUXMfDxSUi8nQthtIi44UBoVpgSCxzcNJLGllcDW8Dp5BFaNtkfBFOlt0zV15GYP8ja8IFF8ncw007blabqEj');

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
    const { orderId, items, customerEmail } = req.body;

    console.log('Creating checkout session for order:', orderId);
    console.log('Items:', items);

    // Calculate subtotal and tax
    const TAX_RATE = 0.09875; // 9.875% for Belmont, CA
    const subtotal = items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity / 100), 0);
    const tax = subtotal * TAX_RATE;
    
    console.log(`=== TAX CALCULATION ===`);
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`Tax Rate: ${TAX_RATE} (${TAX_RATE * 100}%)`);
    console.log(`Tax: $${tax.toFixed(2)}`);
    console.log(`Total: $${(subtotal + tax).toFixed(2)}`);

    // Create items without tax (tax will be separate line item)
    const itemsWithoutTax = items.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.price_data.product_data.name,
                description: item.price_data.product_data.description || 'Book',
                metadata: {
                    book_id: item.price_data.product_data.metadata?.book_id || 'unknown',
                    category: item.price_data.product_data.metadata?.category || 'book',
                    order_id: orderId,
                    tax_separate: 'true',
                    tax_rate: '9.875%',
                    tax_location: 'Belmont, CA 94002'
                }
            },
            unit_amount: item.price_data.unit_amount
        },
        quantity: item.quantity
    }));

    // Add separate tax line item for visibility
    if (tax > 0) {
        itemsWithoutTax.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Sales Tax (9.875% - Belmont, CA)',
                    description: 'California sales tax for Belmont, CA 94002 (San Mateo County)',
                    metadata: {
                        tax_type: 'sales_tax',
                        tax_rate: '9.875%',
                        tax_location: 'Belmont, CA 94002',
                        tax_jurisdiction: 'San Mateo County'
                    }
                },
                unit_amount: Math.round(tax * 100) // Convert to cents
            },
            quantity: 1
        });
        console.log('=== TAX LINE ITEM ADDED ===');
        console.log('Tax amount:', tax);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: itemsWithoutTax,
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
}

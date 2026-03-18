// Vercel serverless function for Stripe checkout
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Calculate tax for order (match local server)
function calculateTax(subtotal) {
    return Math.round(subtotal * 0.09875 * 100) / 100; // Round to 2 decimal places
}

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
    const { orderId, items, customerEmail, metadata = {} } = req.body;

    console.log('=== CHECKOUT SESSION REQUEST ===');
    console.log('Order ID:', orderId);
    console.log('Items received:', JSON.stringify(items, null, 2));
    console.log('Item details:', items.map(item => ({
        name: item.price_data?.product_data?.name,
        description: item.price_data?.product_data?.description,
        category: item.price_data?.product_data?.metadata?.category
    })));
    console.log('=== END REQUEST ===');
    
    console.log('=== TAX DEBUGGING ===');
    console.log('Creating checkout session for order:', orderId);
    console.log('Received items:', JSON.stringify(items, null, 2));

    // Calculate subtotal and tax (match local server)
    const subtotal = items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity / 100), 0);
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;
    
    console.log(`=== TAX CALCULATION ===`);
    console.log(`Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`Tax Rate: 0.09875 (9.875%)`);
    console.log(`Tax: $${tax.toFixed(2)}`);
    console.log(`Total: $${total.toFixed(2)}`);
    console.log(`Tax calculation: ${subtotal} × 0.09875 = ${tax}`);

    // Create items without tax (tax will be separate line item)
    const itemsWithoutTax = items.map(item => {
        console.log('Processing item:', item);
        return {
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
                        tax_location: 'Belmont, CA 94002',
                        original_title: item.price_data.product_data.name // Backup for debugging
                    }
                },
                unit_amount: item.price_data.unit_amount
            },
            quantity: item.quantity
        };
    });

    // Add separate tax line item for visibility
    if (tax > 0) {
      const taxLineItem = {
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
      };
      
      itemsWithoutTax.push(taxLineItem);
      console.log('=== TAX LINE ITEM ADDED ===');
      console.log('Tax amount:', tax);
      console.log('Tax line item:', JSON.stringify(taxLineItem, null, 2));
    }

    console.log('Final items for Stripe:', JSON.stringify(itemsWithoutTax, null, 2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: itemsWithoutTax,
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${req.headers.origin}/index.html?cancelled=true`,
      // customer_email removed to allow customers to enter their own email
      metadata: {
        ...metadata,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        tax_rate: '9.875%',
        tax_location: 'Belmont, CA 94002',
        tax_calculation: `${subtotal} × 0.09875 = ${tax}`,
        pickup_location: 'Enriches Lab Store, Belmont, CA',
        order_type: 'pre-order',
        estimated_arrival: 'Late April 2026',
        shipping_method: 'In-store pickup',
        receipt_note: 'Sales tax shown as separate line item - 9.875% CA sales tax for Belmont, CA'
      },
      automatic_tax: {
        enabled: false // We're handling tax manually
      }
    });

    console.log('Session created:', session.id);
    
    // Save order securely to server-side storage
    try {
        const orderData = {
            sessionId: session.id,
            stripeSessionId: session.id,
            orderId: orderId,
            customerEmail: customerEmail,
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            currency: 'usd',
            status: 'pending',
            created: new Date().toISOString(),
            books: items.map(item => ({
                name: item.price_data.product_data.name,
                quantity: item.quantity,
                price: (item.price_data.unit_amount * item.quantity) / 100
            }))
        };
        
        // Save to secure server storage
        const orderResponse = await fetch(`${req.headers.origin}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (orderResponse.ok) {
            console.log('Order saved securely:', orderId);
        } else {
            console.error('Failed to save order securely');
        }
    } catch (error) {
        console.error('Error saving order:', error);
    }
    
    res.status(200).json({ id: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}

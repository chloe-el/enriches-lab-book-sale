// Simple Node.js server for Stripe Checkout integration
// To run: npm install express stripe cors
// Then: node server.js

const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

// Replace with your actual Stripe secret key
const stripe = Stripe('sk_test_your_stripe_secret_key_here'); // Replace with your key

const app = express();
app.use(cors());
app.use(express.json());

// Create checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;
        
        // Convert items to Stripe format
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    description: `by ${item.author}`,
                    images: [`https://picsum.photos/seed/book${item.id}/400/300`],
                },
                unit_amount: item.price, // Already in cents
            },
            quantity: item.quantity,
        }));

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
            customer_email: null, // Will be collected on Stripe page
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'JP'],
            },
            metadata: {
                order_id: `order_${Date.now()}`,
                items: JSON.stringify(items.map(item => ({
                    id: item.id,
                    title: item.title,
                    quantity: item.quantity
                })))
            }
        });

        res.json({ id: session.id });
        
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Webhook endpoint to handle successful payments
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_your_webhook_secret'); // Replace with your webhook secret
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Create order record
        const order = {
            id: parseInt(session.metadata.order_id.replace('order_', '')),
            date: new Date().toISOString(),
            customer: {
                name: session.customer_details.name,
                email: session.customer_details.email,
                address: session.shipping_details.address
            },
            items: JSON.parse(session.metadata.items),
            total: session.amount_total / 100, // Convert back to dollars
            status: 'paid',
            paymentIntent: session.payment_intent,
            stripeSessionId: session.id
        };
        
        // Here you would save the order to your database
        console.log('Order completed:', order);
        
        // Update inventory (you'd implement this logic)
        console.log('Inventory updated for order:', order.id);
    }
    
    res.json({ received: true });
});

// Success page
app.get('/success.html', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment Successful - Enriches Lab</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
                .success { color: #059669; font-size: 2rem; margin-bottom: 20px; }
                .details { background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto; }
                button { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px; }
            </style>
        </head>
        <body>
            <div class="success">✅ Payment Successful!</div>
            <div class="details">
                <h2>Thank you for your purchase!</h2>
                <p>Your order has been confirmed and will be processed shortly.</p>
                <p>You will receive a confirmation email with your order details.</p>
                <button onclick="window.location.href='/'">Return to Book Sale</button>
            </div>
        </body>
        </html>
    `);
});

// Cancel page
app.get('/cancel.html', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment Cancelled - Enriches Lab</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
                .cancel { color: #dc2626; font-size: 2rem; margin-bottom: 20px; }
                .details { background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto; }
                button { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 10px; }
            </style>
        </head>
        <body>
            <div class="cancel">❌ Payment Cancelled</div>
            <div class="details">
                <h2>Your payment was cancelled</h2>
                <p>Your order has not been processed. You can try again or return to the book sale.</p>
                <button onclick="window.location.href='/'">Return to Book Sale</button>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Visit http://localhost:4242 to use the book store');
});

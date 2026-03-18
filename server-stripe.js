// Stripe server with Stripe as source of truth for orders
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_live_YOUR_LIVE_SECRET_KEY');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Tax configuration for Belmont, CA 94002 (San Mateo County)
const TAX_RATE = 0.09875; // 9.875% sales tax for Belmont, CA (rate Stripe uses for Belmont, CA)

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Raw body parser for webhooks (must be before express.json())
app.use('/webhook', express.raw({type: 'application/json'}));

// Calculate tax for order
function calculateTax(subtotal) {
    return Math.round(subtotal * TAX_RATE * 100) / 100; // Round to 2 decimal places
}

// Stripe checkout session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { orderId, items, metadata } = req.body;
        
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
        
        // Calculate subtotal and tax
        const subtotal = items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity / 100), 0);
        const tax = calculateTax(subtotal);
        const total = subtotal + tax;
        
        console.log(`=== TAX CALCULATION ===`);
        console.log(`Subtotal: $${subtotal.toFixed(2)}`);
        console.log(`Tax Rate: ${TAX_RATE} (${TAX_RATE * 100}%)`);
        console.log(`Tax: $${tax.toFixed(2)}`);
        console.log(`Total: $${total.toFixed(2)}`);
        console.log(`Tax calculation: ${subtotal} × ${TAX_RATE} = ${tax}`);
        
        // Create items without tax (tax will be separate line item)
        let itemsWithoutTax;
        try {
            itemsWithoutTax = items.map(item => {
                const itemSubtotal = item.price_data.unit_amount * item.quantity / 100;
                
                console.log(`Item: ${item.price_data.product_data.name}`);
                console.log(`  Price (no tax): $${itemSubtotal.toFixed(2)}`);
                
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
                                tax_location: 'Belmont, CA 94002'
                            }
                        },
                        unit_amount: item.price_data.unit_amount
                    },
                    quantity: item.quantity
                };
            });
        } catch (error) {
            console.error('Error preparing items without tax:', error);
            // Fallback to original items
            itemsWithoutTax = items;
        }
        
        console.log('=== ITEMS PREPARED ===');
        console.log('Items without tax:', JSON.stringify(itemsWithoutTax, null, 2));
        console.log('=== END DEBUGGING ===');
        
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
            console.log('Tax line item:', {
                name: 'Sales Tax (9.875% - Belmont, CA)',
                amount: Math.round(tax * 100)
            });
        }
        
        let session;
        try {
            console.log('Creating Stripe session...');
            session = await stripe.checkout.sessions.create({
                line_items: itemsWithoutTax,
                mode: 'payment',
                success_url: `${req.headers.origin || 'http://localhost:3000'}/success.html?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin || 'http://localhost:3000'}/cancel.html`,
                customer_email: req.body.customerEmail || null,
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
                    estimated_arrival: 'Late April 2025',
                    shipping_method: 'In-store pickup',
                    receipt_note: 'Sales tax shown as separate line item - 9.875% CA sales tax for Belmont, CA'
                },
                // Add tax display on checkout page
                automatic_tax: {
                    enabled: false // We're handling tax manually
                },
                // Add custom text for tax information
                payment_intent_data: {
                    metadata: {
                        tax_amount: tax.toFixed(2),
                        tax_rate: '9.875%',
                        tax_location: 'Belmont, CA 94002'
                    }
                }
            });
            console.log('Stripe session created successfully:', session.id);
        } catch (stripeError) {
            console.error('Stripe session creation failed:', stripeError);
            console.error('Error details:', JSON.stringify(stripeError, null, 2));
            throw stripeError;
        }

        console.log('Session created:', session.id);
        
        // Store order immediately (backup in case webhook fails)
        const orderData = {
            sessionId: session.id,
            stripeSessionId: session.id, // For easy mapping with Stripe data
            orderId: orderId,
            customerEmail: req.body.customerEmail || 'test@example.com',
            subtotal: subtotal,
            tax: tax,
            total: total,
            currency: 'usd',
            status: 'pending', // Will be updated by webhook
            created: new Date().toISOString(),
            books: items.map(item => ({
                name: item.price_data.product_data.name,
                quantity: item.quantity,
                price: item.price_data.unit_amount / 100
            }))
        };
        
        addOrder(orderData);
        console.log(`💾 Order ${orderId} stored immediately (pending webhook confirmation)`);
        
        // Store order metadata in Stripe session (no external storage needed)
        console.log('=== ORDER STORED IN STRIPE ===');
        console.log('Order ID:', orderId);
        console.log('Items:', items);
        console.log('Customer Email:', req.body.customerEmail || 'test@example.com');
        console.log('Total Amount:', total);
        console.log('Tax:', tax);
        console.log('Timestamp:', new Date().toISOString());
        console.log('Stripe Session ID:', session.id);
        console.log('=== END ORDER ===');
        
        res.json({ id: session.id });
        
    } catch (error) {
        console.error('Stripe session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Apple Pay domain verification endpoint
app.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
    // This file needs to be downloaded from Apple Developer portal and placed in the same directory
    // For now, return a placeholder - you'll need to upload the actual file from Apple
    const filePath = path.join(__dirname, '.well-known', 'apple-developer-merchantid-domain-association');
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Create the directory and file if they don't exist
        const wellKnownDir = path.join(__dirname, '.well-known');
        if (!fs.existsSync(wellKnownDir)) {
            fs.mkdirSync(wellKnownDir);
        }
        
        // Placeholder content - replace with actual file from Apple Developer portal
        const placeholderContent = 'Apple Pay domain verification file - replace with actual content from Apple Developer portal';
        fs.writeFileSync(filePath, placeholderContent);
        
        res.setHeader('Content-Type', 'text/plain');
        res.send(placeholderContent);
    }
});

// Get all successful transactions from Stripe
app.get('/stripe-orders', async (req, res) => {
    try {
        console.log('Fetching all successful Stripe transactions...');
        
        // Use checkout sessions API and filter for successful payments
        const sessions = await stripe.checkout.sessions.list({
            limit: 100,
            expand: ['data.line_items']
        });
        
        // Filter only successful sessions
        const paidSessions = sessions.data.filter(session => session.payment_status === 'paid');
        console.log('Found', paidSessions.length, 'successful sessions out of', sessions.data.length, 'total');
        
        const orders = paidSessions.map(session => {
            const items = session.line_items?.data || [];
            console.log(`Session ${session.id}: Found ${items.length} line items`);
            
            // Filter out tax items - only count actual books
            const bookItems = items.filter(item => {
                const desc = item.description.toLowerCase();
                return !desc.includes('sales tax') && 
                       !desc.includes('tax') &&
                       !desc.includes('belmont, ca');
            });
            
            const books = bookItems.map(item => ({
                name: item.description,
                quantity: item.quantity,
                price: item.amount_total / 100,
                currency: item.currency
            }));
            
            // Check if this is a book order (only look at actual book items)
            const isBookOrder = session.metadata?.order_type === 'pre-order' || 
                                session.metadata?.category === 'book' ||
                                bookItems.some(item => {
                                    const desc = item.description.toLowerCase();
                                    return desc.includes('book') ||
                                           desc.includes('text & solutions') ||
                                           desc.includes('algebra') ||
                                           desc.includes('geometry') ||
                                           desc.includes('counting') ||
                                           desc.includes('number theory') ||
                                           desc.includes('prealgebra') ||
                                           desc.includes('calculus') ||
                                           desc.includes('intermediate');
                                });
            
            return {
                sessionId: session.id,
                orderId: session.metadata?.orderId || 'N/A',
                customerEmail: session.customer_email || 'test@example.com',
                total: session.amount_total / 100,
                currency: session.currency,
                status: session.payment_status,
                created: new Date(session.created * 1000).toISOString(),
                books: books,
                metadata: session.metadata || {},
                isBookOrder: isBookOrder
            };
        });
        
        res.json({
            totalOrders: orders.length,
            orders: orders
        });
        
    } catch (error) {
        console.error('Error fetching Stripe sessions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get order details from Stripe by session ID
app.get('/order/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        console.log('Fetching order details for session:', sessionId);
        
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items']
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const items = session.line_items?.data || [];
        const books = items.map(item => ({
            name: item.description,
            quantity: item.quantity,
            price: item.amount_total / 100,
            currency: item.currency,
            subtotal: (item.amount_total / 100) / item.quantity
        }));
        
        const order = {
            sessionId: session.id,
            orderId: session.metadata?.orderId || 'N/A',
            customerEmail: session.customer_email,
            subtotal: parseFloat(session.metadata?.subtotal || '0'),
            tax: parseFloat(session.metadata?.tax || '0'),
            total: session.amount_total / 100,
            currency: session.currency,
            status: session.payment_status,
            created: new Date(session.created * 1000).toISOString(),
            books: books,
            metadata: session.metadata,
            pickupLocation: 'Enriches Lab Store, Belmont, CA',
            orderType: session.metadata?.order_type || 'pre-order',
            estimatedArrival: session.metadata?.estimated_arrival || 'Late April 2025'
        };
        
        res.json(order);
        
    } catch (error) {
        console.error('Error fetching order from Stripe:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get inventory summary from Stripe data
app.get('/inventory-summary', async (req, res) => {
    try {
        // Get all successful charges
        const charges = await stripe.charges.list({
            limit: 100
        });
        
        // Calculate summary from successful charges only
        let totalRevenue = 0;
        let totalOrders = 0;
        let totalBooks = 0;
        let bookSummary = {};
        
        for (const charge of charges.data) {
            totalOrders++;
            totalRevenue += charge.amount;
            
            // Try to get checkout session details
            if (charge.payment_intent) {
                try {
                    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent, {
                        expand: ['checkout_session']
                    });
                    const session = paymentIntent.checkout_session;
                    
                    if (session && session.line_items?.data) {
                        const items = session.line_items.data;
                        items.forEach(item => {
                            totalBooks += item.quantity;
                            const bookName = item.description;
                            
                            if (!bookSummary[bookName]) {
                                bookSummary[bookName] = {
                                    name: bookName,
                                    quantity: 0,
                                    revenue: 0
                                };
                            }
                            
                            bookSummary[bookName].quantity += item.quantity;
                            bookSummary[bookName].revenue += item.amount_total;
                        });
                    }
                } catch (error) {
                    // Skip if we can't get session details
                }
            }
        }

        // Sort books by quantity
        const sortedBooks = Object.values(bookSummary)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);

        const summary = {
            totalRevenue: totalRevenue / 100, // Convert to dollars
            totalOrders: totalOrders,
            totalBooks: totalBooks,
            averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders / 100).toFixed(2) : 0,
            topBooks: sortedBooks.map(book => ({
                ...book,
                revenue: book.revenue / 100 // Convert to dollars
            })),
            lastUpdated: new Date().toISOString(),
            dataSource: 'Stripe'
        };

        res.json(summary);

    } catch (error) {
        console.error('Error generating inventory summary from Stripe:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get book title counts (dedicated endpoint)
app.get('/book-counts', async (req, res) => {
    try {
        console.log('Fetching book title counts from Stripe...');

        // Get all successful charges
        const charges = await stripe.charges.list({
            limit: 100
        });

        // Count books by title from successful charges
        let bookCounts = {};
        let totalOrders = 0;

        for (const charge of charges.data) {
            totalOrders++;

            // Try to get checkout session details
            if (charge.payment_intent) {
                try {
                    const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent, {
                        expand: ['checkout_session']
                    });
                    const session = paymentIntent.checkout_session;
                    
                    if (session && session.line_items?.data) {
                        const items = session.line_items.data;
                        items.forEach(item => {
                            const bookName = item.description;

                            if (!bookCounts[bookName]) {
                                bookCounts[bookName] = {
                                    title: bookName,
                                    quantity: 0,
                                    revenue: 0,
                                    orders: 0,
                                    averagePrice: 0
                                };
                            }

                            bookCounts[bookName].quantity += item.quantity;
                            bookCounts[bookName].revenue += item.amount_total;
                            bookCounts[bookName].orders += 1;
                        });
                    }
                } catch (error) {
                    // Skip if we can't get session details
                }
            }
        }

        // Calculate averages and sort
        const bookList = Object.values(bookCounts).map(book => ({
            title: book.title,
            quantity: book.quantity,
            revenue: book.revenue / 100, // Convert to dollars
            orders: book.orders,
            averagePrice: book.quantity > 0 ? (book.revenue / book.quantity / 100).toFixed(2) : 0
        }));

// Sort by quantity (most popular first)
const sortedBooks = bookList.sort((a, b) => b.quantity - a.quantity);

const result = {
totalOrders: totalOrders,
totalTitles: sortedBooks.length,
totalBooksSold: sortedBooks.reduce((sum, book) => sum + book.quantity, 0),
books: sortedBooks,
lastUpdated: new Date().toISOString()
};

console.log(`Found ${result.totalTitles} different book titles from ${result.totalOrders} orders`);

res.json(result);

} catch (error) {
console.error('Error fetching book counts:', error);
res.status(500).json({ error: error.message });
}
});

// Order storage functions
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Load existing orders from file
function loadOrders() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const data = fs.readFileSync(ORDERS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

// Save orders to file
function saveOrders(orders) {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
        console.log(`💾 Saved ${orders.length} orders to ${ORDERS_FILE}`);
    } catch (error) {
        console.error('Error saving orders:', error);
    }
}

// Add new order to storage
function addOrder(orderData) {
    const orders = loadOrders();
    
    // Check if order already exists (by session ID)
    const existingIndex = orders.findIndex(order => order.sessionId === orderData.sessionId);
    
    if (existingIndex >= 0) {
        // Update existing order
        orders[existingIndex] = orderData;
        console.log(`🔄 Updated existing order: ${orderData.orderId}`);
    } else {
        // Add new order
        orders.push(orderData);
        console.log(`➕ Added new order: ${orderData.orderId}`);
    }
    
    saveOrders(orders);
    return orderData;
}

// Stripe webhook endpoint for payment completion
app.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        // For development, you might want to skip signature verification
        // In production, uncomment this line:
        // event = stripe.webhooks.constructEvent(req.body, sig, 'your_webhook_secret');
        
        // For now, parse the event directly (less secure but easier for development)
        event = JSON.parse(req.body);
        
        console.log('🔔 Webhook received:', event.type);
        
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log(`💰 Payment completed for session: ${session.id}`);
                
                // Fetch full session details with line items
                const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['line_items']
                });
                
                // Extract order details
                const items = fullSession.line_items?.data || [];
                const books = items.map(item => ({
                    name: item.description,
                    quantity: item.quantity,
                    price: item.amount_total / 100,
                    currency: item.currency
                }));
                
                const orderData = {
                    sessionId: fullSession.id,
                    stripeSessionId: fullSession.id, // For easy mapping with Stripe data
                    orderId: fullSession.metadata?.orderId || 'N/A',
                    customerEmail: fullSession.customer_email,
                    subtotal: parseFloat(fullSession.metadata?.subtotal || '0'),
                    tax: parseFloat(fullSession.metadata?.tax || '0'),
                    total: fullSession.amount_total / 100,
                    currency: fullSession.currency,
                    status: fullSession.payment_status,
                    created: new Date(fullSession.created * 1000).toISOString(),
                    completed: new Date().toISOString(),
                    books: books
                };
                
                // Store order locally
                addOrder(orderData);
                
                console.log(`✅ Order ${orderData.orderId} stored successfully`);
                break;
                
            case 'checkout.session.expired':
                console.log(`⏰ Checkout session expired: ${event.data.object.id}`);
                break;
                
            default:
                console.log(`🔍 Unhandled event type: ${event.type}`);
        }
        
        res.json({received: true});
        
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// Get local orders
app.get('/local-orders', (req, res) => {
    try {
        const orders = loadOrders();
        
        // Add isBookOrder field to each order
        const ordersWithBookFlag = orders.map(order => {
            const isBookOrder = order.books && order.books.some(book => {
                const desc = book.name.toLowerCase();
                return desc.includes('book') ||
                       desc.includes('text & solutions') ||
                       desc.includes('algebra') ||
                       desc.includes('geometry') ||
                       desc.includes('counting') ||
                       desc.includes('number theory') ||
                       desc.includes('prealgebra') ||
                       desc.includes('calculus') ||
                       desc.includes('intermediate');
            });
            
            return {
                ...order,
                isBookOrder: isBookOrder
            };
        });
        
        res.json({
            totalOrders: ordersWithBookFlag.length,
            orders: ordersWithBookFlag.sort((a, b) => new Date(b.created) - new Date(a.created))
        });
    } catch (error) {
        console.error('Error fetching local orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Clear local orders (for testing)
app.delete('/clear-orders', (req, res) => {
    try {
        saveOrders([]);
        console.log('🗑️ Cleared all local orders');
        res.json({ message: 'All local orders cleared successfully' });
    } catch (error) {
        console.error('Error clearing orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark order as completed (called from success page)
app.post('/complete-order', async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID required' });
        }
        
        // Fetch session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items']
        });
        
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }
        
        // Update local order status
        const orders = loadOrders();
        const orderIndex = orders.findIndex(order => order.sessionId === sessionId);
        
        if (orderIndex >= 0) {
            orders[orderIndex].status = 'paid';
            orders[orderIndex].completed = new Date().toISOString();
            
            saveOrders(orders);
            console.log(`✅ Order ${orders[orderIndex].orderId} marked as completed`);
            
            res.json({ 
                success: true, 
                orderId: orders[orderIndex].orderId,
                status: orders[orderIndex].status
            });
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
        
    } catch (error) {
        console.error('Error completing order:', error);
        res.status(500).json({ error: error.message });
    }
});


// Start server
app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log(`📚 Book sale available at http://localhost:${PORT}/index.html`);
console.log(`💳 Stripe endpoint: http://localhost:${PORT}/create-checkout-session`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Book sale available at http://localhost:${PORT}/index.html`);
    console.log(`💳 Stripe endpoint: http://localhost:${PORT}/create-checkout-session`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Server shutting down gracefully...');
    process.exit(0);
});

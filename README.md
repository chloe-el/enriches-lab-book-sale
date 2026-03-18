# 🎓 Enriches Lab Annual Book Sale

A modern, fully-functional book e-commerce website for Enriches Lab with secure Stripe Checkout payment integration and comprehensive order management system.

## Features

### 🛍️ Customer Features
- **Book Catalog**: Browse and search through a curated collection of educational books
- **Shopping Cart**: Add books to cart with quantity management and stock validation
- **Secure Stripe Checkout**: Redirect to Stripe's hosted payment page for maximum security
- **Order Confirmation**: Instant order confirmation with payment status
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### � Payment Security
- **Stripe Checkout Integration**: Customers are redirected to Stripe's secure payment page
- **PCI Compliance**: No credit card data ever touches your servers
- **Multiple Payment Methods**: Support for all major credit cards and digital wallets
- **Global Payments**: Accept payments from customers worldwide

### �📊 Admin Features
- **Order Management**: View all customer orders with details and payment status
- **Inventory Tracking**: Monitor book stock levels with low-stock alerts
- **Sales Analytics**: Track revenue, orders, and top-selling books
- **Real-time Updates**: Automatic stock updates after successful payments

### 🎨 Professional Design
- **Enriches Lab Branding**: Professional educational color scheme
- **Modern UI**: Clean, academic design with smooth animations
- **Book Categories**: Filter by genre (Fiction, Non-Fiction, Mystery, etc.)
- **Search Functionality**: Search by title, author, or description

## Setup Instructions

### 1. Basic Setup (Demo Mode)
The website works immediately in demo mode:
```bash
# Open directly in browser
open index.html

# Or start a simple server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### 2. Full Stripe Integration

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Configure Stripe
1. **Get Stripe API Keys**:
   - Sign up at [Stripe.com](https://stripe.com)
   - Get your Publishable and Secret keys from the Stripe Dashboard

2. **Update Client-Side Key**:
   - Open `script.js`
   - Replace the placeholder key on line 123:
   ```javascript
   const stripe = Stripe('pk_test_your_stripe_publishable_key_here');
   ```

3. **Update Server-Side Key**:
   - Open `server.js`
   - Replace the placeholder key on line 8:
   ```javascript
   const stripe = Stripe('sk_test_your_stripe_secret_key_here');
   ```

#### Step 3: Start the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

#### Step 4: Configure Webhooks (Optional but Recommended)
1. In your Stripe Dashboard, add a webhook endpoint
2. Set the webhook URL to: `https://yourdomain.com/webhook`
3. Select the `checkout.session.completed` event
4. Update the webhook secret in `server.js` line 25

### 3. Production Deployment

#### Environment Variables
For production, use environment variables:
```bash
export STRIPE_PUBLISHABLE_KEY=pk_live_...
export STRIPE_SECRET_KEY=sk_live_...
export STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Security Notes
- Use HTTPS in production (required for Stripe)
- Validate webhook signatures
- Implement proper authentication for admin features
- Use a production database instead of localStorage

## Payment Flow

### 🔄 New Secure Flow
1. **Customer adds books to cart**
2. **Clicks "Proceed to Checkout"**
3. **System creates Stripe Checkout session**
4. **Customer is redirected to Stripe's secure payment page**
5. **Customer enters payment details on Stripe's servers**
6. **Successful payment redirects back to success page**
7. **Webhook confirms payment and creates order**
8. **Stock levels are automatically updated**

### 🛡️ Security Benefits
- **Zero Card Data Exposure**: Credit card details never touch your servers
- **PCI Compliance**: Stripe handles all PCI compliance requirements
- **Fraud Detection**: Stripe's built-in fraud protection
- **SSL Certificates**: All payment data encrypted in transit

## File Structure

```
📁 Enriches Lab Book Sale/
├── 📄 index.html          # Main HTML structure
├── 📄 styles.css          # Professional styling with Enriches Lab colors
├── 📄 script.js           # Frontend JavaScript with Stripe Checkout
├── 📄 server.js           # Node.js backend for payment processing
├── 📄 package.json        # Node.js dependencies
└── 📄 README.md           # This documentation
```

## Book Inventory

The system includes educational books across various genres:

- **Fiction**: The Great Gatsby, To Kill a Mockingbird, The Hobbit
- **Science Fiction**: 1984
- **Romance**: Pride and Prejudice  
- **Mystery**: The Da Vinci Code
- **Non-Fiction**: Sapiens
- **Biography**: Steve Jobs
- **Business**: The Lean Startup
- **Children's**: Harry Potter and the Sorcerer's Stone

### Adding New Books

Edit the `books` array in `script.js`:
```javascript
{
    id: 11,
    title: "New Educational Book",
    author: "Author Name",
    price: 19.99,
    category: "non-fiction",
    description: "Educational book description",
    image: "https://picsum.photos/seed/newbook/400/300",
    isbn: "978-0-123456-78-9",
    stock: 20
}
```

## Order Management

### Viewing Orders
1. Click the admin button (🛡️) in the navigation
2. View the "Orders" tab for all customer orders
3. Orders include payment status, customer details, and items

### Stock Management
- **Automatic Updates**: Stock decreases after successful payments
- **Low Stock Alerts**: Visual indicators when inventory ≤ 5 units
- **Real-time Sync**: Admin dashboard shows current stock levels

### Analytics Dashboard
Track key business metrics:
- Total orders and revenue
- Books sold statistics  
- Average order value
- Top-selling books by quantity and revenue

## Color Theme

The website uses Enriches Lab's professional educational color scheme:

- **Primary Blue**: `#3b82f6` - Headers, buttons, links
- **Dark Blue**: `#1e3a8a` - Header gradients, admin panel
- **Success Green**: `#059669` - Add to cart buttons, success states
- **Professional Grays**: Neutral tones for text and backgrounds

## Troubleshooting

### Payment Issues
- **Server Not Running**: Ensure `npm start` is running for real payments
- **Demo Mode**: Fallback activates automatically when server unavailable
- **Stripe Keys**: Verify both publishable and secret keys are correct
- **Webhook Issues**: Check webhook URL and secret in Stripe Dashboard

### Development Mode
- **Local Testing**: Use Stripe test keys for development
- **Demo Mode**: Works without server for testing UI/UX
- **Console Errors**: Check browser console for Stripe initialization errors

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox  
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Support

### For Production Deployment
1. **Backend Server**: Deploy the Node.js server to a cloud platform
2. **Database**: Replace localStorage with a proper database
3. **Email Service**: Add email notifications for order confirmations
4. **Domain & SSL**: Configure HTTPS and custom domain

### Technical Support
- Stripe Documentation: [stripe.com/docs](https://stripe.com/docs)
- Node.js Express: [expressjs.com](https://expressjs.com)
- For issues specific to this implementation, check the console logs first.

## License

This project is provided for Enriches Lab's annual book sale. Feel free to modify and deploy for educational purposes.
# Test

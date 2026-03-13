// Book inventory data loaded from local JSON file
let books = [];

// Load books from JSON file
async function loadBooksFromJSON() {
    try {
        console.log('Attempting to load books from JSON...');
        const response = await fetch('books.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        console.log(`Successfully loaded ${books.length} books from JSON file`);
        return books;
    } catch (error) {
        console.error('Error loading books from JSON:', error);
        return getFallbackBooks();
    }
}

// Fallback books if JSON file fails
function getFallbackBooks() {
    return [
        {
            id: 1,
            title: "Introduction to Algebra",
            price: 67,
            category: "aops-series"
        },
        {
            id: 2,
            title: "Calculus - text & solutions",
            price: 59,
            category: "aops-series"
        }
    ];
}

// Initialize books from JSON
async function initializeBooks() {
    const booksContainer = document.getElementById('productsGrid');
    
    console.log('Initializing books...');
    
    // Show loading state briefly
    booksContainer.innerHTML = '<div class="loading">Loading books...</div>';
    
    try {
        const books = await loadBooksFromJSON();
        
        console.log(`Books loaded: ${books.length}`, books);
        
        // Update global books variable
        window.books = books;
        
        // Render books
        renderBooks(books);
        
        console.log('Books rendered successfully');
        
    } catch (error) {
        console.error('Failed to initialize books:', error);
        
        // Use fallback books
        const fallbackBooks = getFallbackBooks();
        console.log('Using fallback books:', fallbackBooks);
        window.books = fallbackBooks;
        renderBooks(fallbackBooks);
    }
}

// Shopping cart state
let cart = [];

// Order management
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let orderIdCounter = parseInt(localStorage.getItem('orderIdCounter')) || 1;

// Stripe configuration - Replace with your actual Stripe publishable key
const stripe = Stripe('pk_test_your_stripe_publishable_key_here'); // Replace with your key

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

// Initialize the app
function init() {
    setupEventListeners();
    updateCartUI();
    loadOrders();
    
    // Load books from JSON file
    initializeBooks();
}

// Render books to the grid
function renderBooks(booksToRender) {
    console.log(`Rendering ${booksToRender.length} books...`);
    
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error('productsGrid element not found!');
        return;
    }
    
    productsGrid.innerHTML = '';
    
    if (booksToRender.length === 0) {
        productsGrid.innerHTML = '<div class="empty-cart"><i class="fas fa-search"></i><p>No books found</p></div>';
        console.log('No books to render');
        return;
    }
    
    booksToRender.forEach((book, index) => {
        console.log(`Creating card for book ${index + 1}:`, book.title);
        const bookCard = createBookCard(book);
        productsGrid.appendChild(bookCard);
    });
    
    console.log('Books rendered successfully');
}

// Format category for display
function formatCategory(category) {
    const categoryMap = {
        'beast-academy': 'Beast Academy - Elementary School',
        'aops-series': 'AoPS Series - Middle and High School',
        'math-contest': 'Math Contest - Middle and High School',
        'mathstart': 'MathStart - Early Discovery'
    };
    return categoryMap[category] || category;
}

// Create book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-info">
            <div class="product-category">${formatCategory(book.category)}</div>
            <h3 class="product-name">${book.title}</h3>
            <div class="product-footer">
                <span class="product-price">$${book.price.toFixed(2)}</span>
                <button class="add-to-cart" onclick="addToCart(${book.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    return card;
}

// Add book to cart
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity++;
        showNotification(`Added another "${book.title}" to cart`);
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            price: book.price,
            quantity: 1
        });
        showNotification(`"${book.title}" added to cart`);
    }
    
    updateCartUI();
    saveCart();
}

// Remove item from cart
function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    updateCartUI();
}

// Update item quantity
function updateQuantity(bookId, change) {
    const item = cart.find(item => item.id === bookId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(bookId);
    } else {
        updateCartUI();
        saveCart();
    }
}

// Update cart UI
function updateCartUI() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart items display
function updateCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Filter and sort books
function filterAndSortBooks() {
    let filteredBooks = [...books];
    
    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm)
        );
    }
    
    // Category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'all') {
        filteredBooks = filteredBooks.filter(book =>
            book.category === selectedCategory
        );
    }
    
    // Sort books
    const sortOption = sortFilter.value;
    switch (sortOption) {
        case 'price-low':
            filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    renderBooks(filteredBooks);
}

// Show payment modal
function showPaymentModal() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Redirect to Stripe Checkout instead of showing modal
    redirectToStripeCheckout();
}

// Redirect to Stripe Checkout for secure payment
async function redirectToStripeCheckout() {
    if (!stripe) {
        showNotification('Payment system is not available. Please try again later.');
        return;
    }
    
    const payBtn = document.getElementById('checkoutBtn');
    const originalText = payBtn.textContent;
    
    // Show loading state
    payBtn.disabled = true;
    payBtn.textContent = 'Creating payment...';
    
    try {
        // Try to create checkout session on server
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    id: item.id,
                    title: item.title,
                    author: item.author,
                    price: item.price * 100, // Convert to cents
                    quantity: item.quantity
                }))
            })
        });
        
        if (response.ok) {
            const session = await response.json();
            
            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });
            
            if (result.error) {
                throw result.error;
            }
        } else {
            throw new Error('Server not available');
        }
        
    } catch (error) {
        console.error('Payment redirect error:', error);
        
        // Fallback to demo mode when server isn't available
        showNotification('Demo mode: Server not available. Using fallback payment...');
        
        // Simulate payment and create order
        await simulatePaymentForDemo();
        
        // Clear cart and show success
        cart = [];
        updateCartUI();
        cartModal.classList.remove('active');
        
        showNotification('Order placed successfully! (Demo mode - no actual payment processed)');
    } finally {
        // Reset loading state
        payBtn.disabled = false;
        payBtn.textContent = originalText;
    }
}

// Demo payment simulation when server isn't available
async function simulatePaymentForDemo() {
    // Create order for demo
    const order = {
        id: orderIdCounter++,
        date: new Date().toISOString(),
        customer: {
            name: 'Demo Customer',
            email: 'demo@enricheslab.com',
            address: 'Demo Address'
        },
        items: cart.map(item => ({
            id: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'paid',
        paymentToken: 'demo_payment_' + Date.now()
    };
    
    // Update book stock
    cart.forEach(cartItem => {
        const book = books.find(b => b.id === cartItem.id);
        if (book) {
            book.stock -= cartItem.quantity;
        }
    });
    
    // Save order
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('orderIdCounter', orderIdCounter.toString());
    
    renderBooks(books); // Refresh book display to update stock
}

// Fallback: Simulate checkout session creation (for demo without backend)
async function createDemoCheckoutSession() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock session data
    return {
        id: 'cs_demo_' + Date.now(),
        url: null // We'll handle this differently for demo
    };
}

// Update order summary in payment modal
function updateOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item-summary">
            <div>${item.title} x ${item.quantity}</div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = total.toFixed(2);
}

// Process payment
async function processPayment(e) {
    e.preventDefault();
    
    if (!stripe || !cardElement) {
        showNotification('Payment system is not available. Please try again later.');
        return;
    }
    
    const payBtn = document.getElementById('payBtn');
    const payBtnText = document.getElementById('pay-btn-text');
    const spinner = document.getElementById('payment-spinner');
    
    // Show loading state
    payBtn.disabled = true;
    payBtnText.textContent = 'Processing...';
    spinner.style.display = 'block';
    
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerAddress = document.getElementById('customer-address').value;
    
    try {
        // For demo purposes, we'll simulate payment processing
        // In production, you would create a payment intent on your server
        const { token, error } = await stripe.createToken(cardElement, {
            name: customerName,
            address_line1: customerAddress
        });
        
        if (error) {
            throw error;
        }
        
        // Simulate payment confirmation
        await simulatePayment(token.id, customerEmail, customerName, customerAddress);
        
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Payment failed: ' + error.message);
    } finally {
        // Reset loading state
        payBtn.disabled = false;
        payBtnText.textContent = 'Pay Now';
        spinner.style.display = 'none';
    }
}

// Simulate payment processing (replace with actual backend call)
async function simulatePayment(token, email, name, address) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create order
    const order = {
        id: orderIdCounter++,
        date: new Date().toISOString(),
        customer: {
            name: name,
            email: email,
            address: address
        },
        items: cart.map(item => ({
            id: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'paid',
        paymentToken: token
    };
    
    // Update book stock
    cart.forEach(cartItem => {
        const book = books.find(b => b.id === cartItem.id);
        if (book) {
            book.stock -= cartItem.quantity;
        }
    });
    
    // Save order
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('orderIdCounter', orderIdCounter.toString());
    
    // Clear cart and close modals
    cart = [];
    updateCartUI();
    paymentModal.classList.remove('active');
    
    showNotification(`Order #${order.id} placed successfully! Confirmation sent to ${email}`);
    renderBooks(books); // Refresh book display to update stock
}

// Load orders from localStorage
function loadOrders() {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    orderIdCounter = parseInt(localStorage.getItem('orderIdCounter')) || 1;
}

// Setup event listeners
function setupEventListeners() {
    // Cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    // Checkout button - redirects to Stripe
    checkoutBtn.addEventListener('click', showPaymentModal);
    
    // Modal close on background click
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    
    // Search and filters
    searchInput.addEventListener('input', filterAndSortBooks);
    categoryFilter.addEventListener('change', filterAndSortBooks);
    sortFilter.addEventListener('change', filterAndSortBooks);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal.classList.contains('active')) {
            cartModal.classList.remove('active');
        }
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }
    
    .product-author {
        color: #6c757d;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .stock-info {
        color: #6c757d;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }
    
    .order-item-summary {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f8f9fa;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

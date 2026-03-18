// Book inventory data loaded from local JSON file (Primary source)
let books = [];

// Load books from JSON file (Primary source)
async function loadBooksFromJSON() {
    try {
        console.log('📡 Loading books from JSON...');
        
        // Add cache-busting parameter to prevent browser caching
        const timestamp = Date.now();
        const response = await fetch(`books.json?t=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        console.log(`Successfully loaded ${books.length} books from JSON file`);
        return books;
    } catch (error) {
        console.error('❌ Error loading books from JSON:', error);
        console.log('🔄 Checking if fetch is blocked...');
        
        // Check if it's a CORS or network issue
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.error('🚫 Fetch blocked - possible CORS issue');
        } else if (error.name === 'TypeError' && error.message.includes('network')) {
            console.error('🌐 Network issue - check server connection');
        } else {
            console.error('🔍 Other fetch error:', error);
        }
        
        console.log('📚 Using embedded books as fallback...');
        return getEmbeddedBooks();
    }
}

// Embedded books data (fallback when JSON loading fails)
function getEmbeddedBooks() {
    return [
        {
            "id": 26,
            "title": "Prealgebra - text & solutions",
            "price": 50.15,
            "original_price": 59,
            "category": "aops-series"
        },
        {
            "id": 7,
            "title": "Introduction to Algebra - text & solutions",
            "price": 56.95,
            "original_price": 67,
            "category": "aops-series"
        },
        {
            "id": 8,
            "title": "Introduction to Counting & Probability - text & solutions",
            "price": 41.65,
            "original_price": 49,
            "category": "aops-series"
        },
        {
            "id": 9,
            "title": "Introduction to Geometry - text & solutions",
            "price": 55.25,
            "original_price": 65,
            "category": "aops-series"
        },
        {
            "id": 10,
            "title": "Introduction to Number Theory - text & solutions",
            "price": 46.75,
            "original_price": 55,
            "category": "aops-series"
        },
        {
            "id": 5,
            "title": "Intermediate Algebra - text & solutions",
            "price": 62.9,
            "original_price": 74,
            "category": "aops-series"
        },
        {
            "id": 6,
            "title": "Intermediate Counting & Probability - text & solutions",
            "price": 47.6,
            "original_price": 56,
            "category": "aops-series"
        },
        {
            "id": 27,
            "title": "Precalculus - text & solutions",
            "price": 52.7,
            "original_price": 62,
            "category": "aops-series"
        },
        {
            "id": 1,
            "title": "Calculus - text & solutions",
            "price": 50.15,
            "original_price": 59,
            "category": "aops-series"
        },
        {
            "id": 2,
            "title": "Competition Math for Middle School",
            "price": 25.08,
            "original_price": 29.5,
            "category": "math-contest"
        },
        {
            "id": 3,
            "title": "Contest Prep Math - Art of Problem Solving - Volume 1",
            "price": 39.95,
            "original_price": 47,
            "category": "math-contest"
        },
        {
            "id": 4,
            "title": "Contest Prep Math - Art of Problem Solving - Volume 2",
            "price": 41.65,
            "original_price": 49,
            "category": "math-contest"
        },
        {
            "id": 11,
            "title": "Level 1 - Guide - A-D - 4 books",
            "price": 91.8,
            "original_price": 108,
            "category": "beast-academy"
        },
        {
            "id": 12,
            "title": "Level 2 - Guide - A-D - 4 books",
            "price": 54.4,
            "original_price": 64,
            "category": "beast-academy"
        },
        {
            "id": 14,
            "title": "Level 2 - Practice - A-D - 4 books",
            "price": 47.6,
            "original_price": 56,
            "category": "beast-academy"
        },
        {
            "id": 15,
            "title": "Level 2 - Puzzle - 1 book",
            "price": 8.5,
            "original_price": 10,
            "category": "beast-academy"
        },
        {
            "id": 16,
            "title": "Level 3 - Guide A-D - 4 books",
            "price": 54.4,
            "original_price": 64,
            "category": "beast-academy"
        },
        {
            "id": 17,
            "title": "Level 3 - Practice - A-D - 4 books",
            "price": 47.6,
            "original_price": 56,
            "category": "beast-academy"
        },
        {
            "id": 18,
            "title": "Level 3 - Puzzle - 1book",
            "price": 8.5,
            "original_price": 10,
            "category": "beast-academy"
        },
        {
            "id": 19,
            "title": "Level 3 - Science - 3A & 3B - 2 books",
            "price": 81.6,
            "original_price": 96,
            "category": "beast-academy"
        },
        {
            "id": 20,
            "title": "Level 4 - Guide A-D - 4 books",
            "price": 54.4,
            "original_price": 64,
            "category": "beast-academy"
        },
        {
            "id": 21,
            "title": "Level 4 - Practice - A-D - 4 books",
            "price": 47.6,
            "original_price": 56,
            "category": "beast-academy"
        },
        {
            "id": 22,
            "title": "Level 4 - Puzzle - 1book",
            "price": 8.5,
            "original_price": 10,
            "category": "beast-academy"
        },
        {
            "id": 23,
            "title": "Level 4 - Science - 4A - 1 book",
            "price": 40.8,
            "original_price": 48,
            "category": "beast-academy"
        },
        {
            "id": 24,
            "title": "Level 5 - Guide A-D - 4 books",
            "price": 54.4,
            "original_price": 64,
            "category": "beast-academy"
        },
        {
            "id": 25,
            "title": "Level 5 - Practice - A-D - 4 books",
            "price": 47.6,
            "original_price": 56,
            "category": "beast-academy"
        },
        {
            "id": 28,
            "title": "MathStart - Level 1 - 21 books",
            "price": 132.15,
            "category": "mathstart"
        },
        {
            "id": 29,
            "title": "MathStart - Level 2 - 21 books",
            "price": 132.15,
            "category": "mathstart"
        },
        {
            "id": 30,
            "title": "MathStart - Level 3 - 21 books",
            "price": 132.15,
            "category": "mathstart"
        }
    ];
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
    console.log('🔄 Clearing caches and loading fresh data...');
    
    // Preserve order counter while clearing other caches
    const orderIdCounter = localStorage.getItem('orderIdCounter');
    const orders = localStorage.getItem('orders');
    
    // Clear all caches to prevent stale data
    localStorage.clear();
    sessionStorage.clear();
    
    // Restore important data
    if (orderIdCounter) {
        localStorage.setItem('orderIdCounter', orderIdCounter);
        console.log('🔄 Preserved order ID counter:', orderIdCounter);
    }
    if (orders) {
        localStorage.setItem('orders', orders);
        console.log('🔄 Preserved orders data');
    }
    
    // Force page reload if this is a fresh start (no previous data)
    const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
        console.log('🔄 First visit detected, forcing fresh start...');
        sessionStorage.setItem('hasVisitedBefore', 'true');
    } else {
        console.log('🔄 Returning visitor, using cached data...');
        sessionStorage.removeItem('hasVisitedBefore');
    }
    
    // Force reload books from JSON
    const booksContainer = document.getElementById('productsGrid');
    
    console.log('🎯 Looking for booksContainer:', booksContainer);
    
    // Show loading state briefly
    if (booksContainer) {
        booksContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading fresh books data...</p></div>';
        console.log('📡 Showing loading state');
    }
    
    try {
        // Load books from JSON file (primary source)
        console.log('📡 Loading books from JSON...');
        const loadedBooks = await loadBooksFromJSON();
        
        console.log(`📚 Books loaded: ${loadedBooks.length}`, loadedBooks);
        
        // Store books globally
        books = loadedBooks;
        
        // Hide loading state
        if (booksContainer) {
            booksContainer.innerHTML = '';
        }
        
        // Render all books initially
        console.log('🎨 Rendering all books after successful load...');
        renderBooks(books);
        
    } catch (error) {
        console.error('❌ Failed to initialize books:', error.message || error);
        console.log('🔄 Using fallback books...');
        
        // Get fallback books and ensure they're properly loaded
        const fallbackBooks = getFallbackBooks();
        console.log('📚 Fallback books loaded:', fallbackBooks.length);
        
        // Store fallback books globally
        books = fallbackBooks;
        
        // Try to render fallback books
        if (booksContainer && fallbackBooks.length > 0) {
            console.log('🎨 Rendering fallback books...');
            renderBooks(fallbackBooks);
        } else {
            console.log('❌ No books available to render');
            if (booksContainer) {
                booksContainer.innerHTML = '<div class="empty-cart"><i class="fas fa-search"></i><p>No books found</p></div>';
            }
        }
    }
    
    loadOrders();
    setupEventListeners();
}

// Shopping cart state
let cart = [];

// Cart management functions
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    cart = JSON.parse(storedCart) || [];
    console.log('🛒 Cart loaded from localStorage:', storedCart);
    console.log('🛒 Parsed cart:', cart);
    console.log('🛒 Cart length after loading:', cart.length);
}

// Order management
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let orderIdCounter = parseInt(localStorage.getItem('orderIdCounter')) || 1;

// Stripe configuration - Replace with your actual Stripe publishable key
const stripe = Stripe('pk_live_...'); // Replace with your live publishable key

// DOM elements will be initialized after DOM is ready
let productsGrid, cartBtn, cartModal, closeCart, cartItems, cartCount, cartTotal, checkoutBtn, searchInput, categoryFilter;

// Initialize the app
function init() {
    console.log('🚀 Starting app initialization (script at end of body)...');
    initializeApp();
}

// Load orders from localStorage
function loadOrders() {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
        console.log('📋 Loaded orders:', orders.length);
    }
}

function initializeApp() {
    // Initialize DOM elements first
    productsGrid = document.getElementById('productsGrid');
    cartBtn = document.getElementById('cartBtn');
    cartModal = document.getElementById('cartModal');
    closeCart = document.getElementById('closeCart');
    cartItems = document.getElementById('cartItems');
    cartCount = document.getElementById('cartCount');
    cartTotal = document.getElementById('cartTotal');
    checkoutBtn = document.getElementById('checkoutBtn');
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    
    // Check if user returned from Stripe (cancelled payment)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('cancelled') === 'true') {
        console.log('🔄 User returned from cancelled Stripe checkout - resetting UI');
        // Reset checkout button if it's frozen
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Proceed to Checkout';
        }
        showNotification('Payment was cancelled. You can try again when ready.');
    }
    
    loadCart();
    setupEventListeners();
    updateCartUI();
    loadOrders();
    initializeBooks();
}

// Render books to the grid
function renderBooks(booksToRender) {
    console.log(` renderBooks called with ${booksToRender.length} books, DOM ready: ${document.readyState}`);
    
    if (document.readyState !== 'complete') {
        console.log(' DOM not ready, waiting...');
        setTimeout(renderBooks, 100, booksToRender);
        return;
    }
    
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
        'beast-academy': 'Beast Academy',
        'aops-series': 'AoPS Series', 
        'math-contest': 'Math Contest',
        'mathstart': 'MathStart'
    };
    return categoryMap[category] || category;
}

// Create book card element
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Check if book has discount or is MathStart (show in red)
    const hasDiscount = book.original_price && book.original_price > book.price;
    const isMathStart = book.category === 'mathstart';
    
    let priceDisplay;
    if (hasDiscount) {
        priceDisplay = `<span class="product-price-discounted">
            <span class="original-price">$${book.original_price.toFixed(2)}</span>
            <span class="discounted-price">$${book.price.toFixed(2)}</span>
           </span>`;
    } else if (isMathStart) {
        priceDisplay = `<span class="product-price mathstart-price">$${book.price.toFixed(2)}</span>`;
    } else {
        priceDisplay = `<span class="product-price">$${book.price.toFixed(2)}</span>`;
    }
    
    card.innerHTML = `
        <div class="product-info">
            <div class="product-category">${formatCategory(book.category)}</div>
            <h3 class="product-name">${book.title}</h3>
            <div class="product-footer">
                ${priceDisplay}
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
    console.log('🛒 Adding to cart - bookId:', bookId);
    console.log('📚 Available books:', books.map(b => ({id: b.id, title: b.title, category: b.category})));
    
    const book = books.find(b => b.id === bookId);
    if (!book) {
        console.error('❌ Book not found with ID:', bookId);
        return;
    }
    
    console.log('✅ Found book:', {id: book.id, title: book.title, category: book.category});
    
    // Clear any existing cart cache to ensure fresh data
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) {
        existingItem.quantity++;
        showNotification(`Added another "${book.title}" to cart`);
    } else {
        cart.push({
            id: book.id,
            title: book.title,
            category: book.category,
            price: book.price,
            quantity: 1
        });
        showNotification(`"${book.title}" added to cart`);
    }
    
    // Force cart save and UI refresh
    saveCart();
    updateCartUI();
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
    
    console.log('Starting filter with books:', filteredBooks.length);
    console.log('Global books variable:', window.books);
    console.log('Local books variable:', books);
    
    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm)
        );
        console.log('After search filter:', filteredBooks.length);
    }
    
    // Category filter
    const selectedCategory = categoryFilter.value;
    console.log('Selected category:', selectedCategory);
    console.log('Available categories:', [...new Set(books.map(book => book.category))]);
    
    if (selectedCategory !== 'all') {
        filteredBooks = filteredBooks.filter(book => {
            const matches = book.category === selectedCategory;
            console.log(`Book: ${book.title} | Category: ${book.category} | Selected: ${selectedCategory} | Match: ${matches}`);
            return matches;
        });
        console.log('After category filter:', filteredBooks.length);
    }
    
    console.log('Final filtered books:', filteredBooks.length);
    renderBooks(filteredBooks);
}

// Show payment modal
function showPaymentModal() {
    console.log('💳 showPaymentModal called');
    console.log('💳 Cart length in showPaymentModal:', cart.length);
    console.log('💳 Cart contents in showPaymentModal:', cart);
    
    if (cart.length === 0) {
        console.log('❌ Cart is empty in showPaymentModal, showing notification');
        showNotification('Your cart is empty!');
        return;
    }
    
    // Redirect to Stripe Checkout instead of showing modal
    console.log('💳 Redirecting to Stripe checkout...');
    redirectToStripeCheckout();
}

// Direct Stripe Checkout (no backend required)
async function redirectToStripeCheckout() {
    console.log('🛒 Checkout button clicked');
    console.log('🛒 Cart length:', cart.length);
    console.log('🛒 Cart contents:', cart);
    
    if (cart.length === 0) {
        console.log('❌ Cart is empty, showing notification');
        showNotification('Your cart is empty!');
        return;
    }
    
    const payBtn = checkoutBtn;
    const originalText = payBtn.textContent;
    
    // Show loading state
    payBtn.disabled = true;
    payBtn.textContent = 'Creating payment...';
    
    try {
        // Generate sequential order ID
        const orderNumber = (orderIdCounter++).toString().padStart(4, '0');
        const orderId = `ORD-2026ABS-${orderNumber}`;
        
        // Save updated counter
        localStorage.setItem('orderIdCounter', orderIdCounter.toString());
        
        console.log('� Creating direct Stripe checkout for order:', orderId);
        
        // Create checkout session on server (restore original backend approach)
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                orderId: orderId, 
                items: cart.map(item => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.title,
                            description: item.category || 'Book',
                            metadata: {
                                category: item.category,
                                book_id: item.id.toString(),
                                order_id: orderId
                            }
                        },
                        unit_amount: Math.round(item.price * 100)
                    },
                    quantity: item.quantity
                })),
                customerEmail: 'customer@example.com'
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            
            // Fallback for local testing
            if (response.status === 501) {
                console.log('🧪 Local testing detected - showing demo order confirmation');
                showOrderConfirmation({
                    id: orderId,
                    items: cart,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    timestamp: new Date().toISOString()
                });
                
                // Clear cart
                cart = [];
                saveCart();
                updateCartUI();
                
                // Store order
                orders.push({
                    id: orderId,
                    items: cart,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('orders', JSON.stringify(orders));
                
                return;
            }
            
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const session = await response.json();
        
        // Redirect to Stripe with session ID
        await stripe.redirectToCheckout({ sessionId: session.id });
        
    } catch (error) {
        console.error('❌ Payment setup error:', error);
        showNotification('Payment setup failed: ' + error.message);
    } finally {
        // Reset button
        payBtn.disabled = false;
        payBtn.textContent = originalText;
    }
}

// Show order details for manual payment processing
function showOrderDetailsModal(order) {
    const modal = document.createElement('div');
    modal.className = 'order-details-modal';
    modal.innerHTML = `
        <div class="order-details-content">
            <h2>🛒 Order Summary</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            
            <div class="order-books">
                <h3>Books:</h3>
                ${order.items.map(item => `
                    <div class="order-book-item">
                        <span>${item.title}</span>
                        <span>${item.quantity} × $${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Sales Tax (9.875% - Belmont, CA):</span>
                    <span id="tax-amount">Calculating...</span>
                </div>
                <div class="summary-row total-row">
                    <span><strong>Total:</strong></span>
                    <span id="total-amount">Calculating...</span>
                </div>
            </div>
            
            <div class="payment-options">
                <h3>Payment Options:</h3>
                <div class="pickup-info">
                    <h4>📍 Pre-Order Information</h4>
                    <p><strong>Location:</strong> Enriches Lab Store, Belmont, CA</p>
                    <p><strong>Type:</strong> Pre-order - Books will be shipped to Enriches Lab</p>
                    <p><strong>Estimated Arrival:</strong> Last week of April 2025</p>
                    <p><strong>Notification:</strong> We'll email you when books are available for pickup</p>
                </div>
                <p>Total amount: <strong id="payment-total">Calculating...</strong></p>
                <p>Click below to pay with Stripe (amount includes tax):</p>
                <button onclick="redirectToStripePayment('${order.total.toFixed(2)}', '${order.id}')" class="btn-primary">
                    Pay $<span id="checkout-total">Calculating...</span> with Stripe
                </button>
                <p style="font-size: 0.9rem; color: #6b7280; margin-top: 1rem;">
                    Sales tax of 9.875% will be added for Belmont, CA (San Mateo County).<br>
                    No shipping - books will be available for in-store pickup after arrival.
                </p>
            </div>
            
            <div class="modal-actions">
                <button onclick="this.closest('.order-details-modal').remove()" class="btn-secondary">
                    Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Calculate and display tax
    const subtotal = order.total;
    const taxRate = 0.09875; // 9.875% for Belmont, CA
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = subtotal + tax;
    
    // Update tax display
    setTimeout(() => {
        const taxElement = document.getElementById('tax-amount');
        const totalElement = document.getElementById('total-amount');
        const paymentElement = document.getElementById('payment-total');
        const checkoutElement = document.getElementById('checkout-total');
        
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
        if (paymentElement) paymentElement.textContent = `$${total.toFixed(2)}`;
        if (checkoutElement) checkoutElement.textContent = total.toFixed(2);
    }, 100);
}

// Redirect to Stripe with server method
async function redirectToStripePayment(amount, orderId) {
    // Store order info for success page
    sessionStorage.setItem('pendingOrder', JSON.stringify({
        orderId: orderId,
        amount: amount,
        timestamp: new Date().toISOString(),
        customerEmail: 'test@example.com' // Add your email here for testing
    }));
    
    const payBtn = document.getElementById('checkoutBtn');
    const originalText = payBtn.textContent;
    
    // Show loading state
    payBtn.disabled = true;
    payBtn.textContent = 'Creating payment...';
    
    try {
        // Create checkout session on server
        const response = await fetch('/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                orderId: orderId, 
                items: cart,
                customerEmail: 'test@example.com' // You can add email field
            })
        });
        
        console.log('📡 Response received:', response.status);
        
        const session = await response.json();
        console.log('💳 Stripe session created:', session.id);
        
        // Store pending order info in sessionStorage
        const pendingOrder = {
            orderId: orderId,
            sessionId: session.id,
            amount: parseFloat(amount),
            timestamp: new Date().toISOString(),
            items: cart
        };
        sessionStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
        
        console.log('💾 Pending order stored in sessionStorage:', pendingOrder);
        
        // Redirect to Stripe with session_id parameter
        console.log('🔄 Redirecting to Stripe checkout...');
        
        // Store session info before redirect
        sessionStorage.setItem('stripeSessionId', session.id);
        
        await stripe.redirectToCheckout({ sessionId: session.id });
        
    } catch (error) {
        console.error('❌ Payment error:', error);
        showNotification('Payment failed. Please try again.');
    } finally {
        // Restore button state
        payBtn.disabled = false;
        payBtn.textContent = originalText;
    }
}

// Show order confirmation
function showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'order-confirmation-modal';
    modal.innerHTML = `
        <div class="order-confirmation-content">
            <h2>🎉 Order Confirmed!</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <div class="order-summary">
                <h3>Order Details:</h3>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.title} (${item.category})</span>
                        <span>${item.quantity} × $${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
                <div class="order-total">
                    <strong>Total: $${order.total.toFixed(2)}</strong>
                </div>
            </div>
            <div class="pickup-info">
                <h4>📍 Pickup Information</h4>
                <p><strong>Location:</strong> Enriches Lab Store, Belmont, CA</p>
                <p><strong>Estimated Arrival:</strong> Late April 2025</p>
                <p><strong>Notification:</strong> We'll email you when books are ready for pickup</p>
                <p><em>9.875% sales tax will be added at pickup</em></p>
            </div>
            <div class="modal-actions">
                <button onclick="this.closest('.order-confirmation-modal').remove()" class="btn-primary">
                    Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 10000);
}

// Setup event listeners
function setupEventListeners() {
    // Cart button
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartModal.classList.add('active');
        });
    }
    
    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showPaymentModal);
    }
    
    // Search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterAndSortBooks);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortBooks);
    }
    
    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal && cartModal.classList.contains('active')) {
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
    
    .order-confirmation-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .order-confirmation-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .order-summary {
        margin: 1rem 0;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .order-total {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid #333;
    }
    
    .pickup-info {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        margin: 1rem 0;
    }
    
    .modal-actions {
        text-align: center;
        margin-top: 1rem;
    }
    
    .btn-primary {
        background: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .btn-primary:hover {
        background: #0056b3;
    }
`;
document.head.appendChild(style);

// Initialize app immediately (script is at end of body, so DOM is ready)
init();

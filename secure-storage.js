// Secure storage utilities for production
// This handles customer data securely without exposing it in public code

class SecureStorage {
    constructor() {
        this.isProduction = process?.env?.NODE_ENV === 'production' || window.location.hostname !== 'localhost';
        this.useServerStorage = this.isProduction;
    }

    // Store order data securely
    storeOrder(orderData) {
        if (this.useServerStorage) {
            // In production, send to server instead of localStorage
            return this.sendToServer('/api/orders', orderData);
        } else {
            // Development: use localStorage
            const orders = this.getOrders();
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
            return Promise.resolve(orderData);
        }
    }

    // Get orders securely
    getOrders() {
        if (this.useServerStorage) {
            // In production, fetch from server
            return this.fetchFromServer('/api/orders');
        } else {
            // Development: use localStorage
            const stored = localStorage.getItem('orders');
            return stored ? JSON.parse(stored) : [];
        }
    }

    // Clear sensitive data
    clearCustomerData() {
        if (this.useServerStorage) {
            // In production, clear server-side session data
            return this.sendToServer('/api/clear-session', {});
        } else {
            // Development: clear localStorage
            localStorage.removeItem('orders');
            localStorage.removeItem('pendingOrder');
            return Promise.resolve();
        }
    }

    // Helper: Send data to server
    async sendToServer(endpoint, data) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Server storage error:', error);
            throw error;
        }
    }

    // Helper: Fetch data from server
    async fetchFromServer(endpoint) {
        try {
            const response = await fetch(endpoint);
            return await response.json();
        } catch (error) {
            console.error('Server fetch error:', error);
            return [];
        }
    }
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureStorage;
} else {
    window.SecureStorage = SecureStorage;
}

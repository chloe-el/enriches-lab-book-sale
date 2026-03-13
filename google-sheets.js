// Google Sheets integration for book inventory
// Replace with your Google Sheet ID and API key

const GOOGLE_SHEET_ID = '1SCi7-4l-ky4ko4Hp8YOHyuyB5jgwdYoQCcTjnbtpKGk'; // Replace with your sheet ID
const GOOGLE_API_KEY = 'AIzaSyCIYMqeECBBr-chJsEJ7Z2kiVqKQX3GZ9g';   // Replace with your API key
const SHEET_RANGE = 'Sheet1!A:H'; // Adjust range based on your sheet structure

// Local storage key for cached books data
const CACHED_BOOKS_KEY = 'enriches_lab_books_cache';
const CACHE_TIMESTAMP_KEY = 'enriches_lab_books_cache_timestamp';

// Load books from cache or Google Sheets
async function loadBooks() {
    // First, try to load from cache
    const cachedBooks = loadBooksFromCache();
    if (cachedBooks) {
        console.log('Loaded books from cache');
        return cachedBooks;
    }
    
    // If no cache, load from Google Sheets
    console.log('No cache found, loading from Google Sheets');
    return await loadBooksFromGoogleSheets();
}

// Load books from local cache
function loadBooksFromCache() {
    try {
        const cachedData = localStorage.getItem(CACHED_BOOKS_KEY);
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        
        if (cachedData && timestamp) {
            const books = JSON.parse(cachedData);
            console.log(`Loaded ${books.length} books from cache (cached at ${new Date(parseInt(timestamp)).toLocaleString()})`);
            return books;
        }
    } catch (error) {
        console.error('Error loading books from cache:', error);
    }
    return null;
}

// Save books to local cache
function saveBooksToCache(books) {
    try {
        localStorage.setItem(CACHED_BOOKS_KEY, JSON.stringify(books));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log(`Cached ${books.length} books locally`);
    } catch (error) {
        console.error('Error saving books to cache:', error);
    }
}

// Force refresh books from Google Sheets
async function refreshBooksFromGoogleSheets() {
    console.log('Force refreshing books from Google Sheets...');
    
    try {
        const books = await loadBooksFromGoogleSheets();
        saveBooksToCache(books);
        return books;
    } catch (error) {
        console.error('Error refreshing books from Google Sheets:', error);
        // Return cached books if available, otherwise fallback
        return loadBooksFromCache() || getFallbackBooks();
    }
}

// Load books from Google Sheets (original function)
async function loadBooksFromGoogleSheets() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_RANGE}?key=${GOOGLE_API_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
            throw new Error('No data found in Google Sheets');
        }
        
        // Convert Google Sheets data to book objects
        const books = convertSheetDataToBooks(data.values);
        
        console.log(`Successfully loaded ${books.length} books from Google Sheets`);
        return books;
        
    } catch (error) {
        console.error('Error loading books from Google Sheets:', error);
        throw error;
    }
}

// Convert Google Sheets data to book objects
function convertSheetDataToBooks(rows) {
    // Skip header row and convert each row to a book object
    const books = [];
    
    // Expected column order (adjust based on your sheet):
    // A: ID, B: Title, C: Author, D: Price, E: Category, F: Description, G: Image, H: Stock, I: ISBN
    
    for (let i = 1; i < rows.length; i++) { // Skip header row (row 0)
        const row = rows[i];
        
        if (row.length >= 8) { // Ensure we have enough columns
            const book = {
                id: parseInt(row[0]) || i + 1,
                title: row[1] || 'Untitled Book',
                author: row[2] || 'Unknown Author',
                price: parseFloat(row[3]) || 0,
                category: row[4] || 'other',
                description: row[5] || 'No description available',
                image: row[6] || `https://picsum.photos/seed/book${i + 1}/400/300`,
                stock: parseInt(row[7]) || 0,
                isbn: row[8] || `978-0-7432-7356-${i + 1}`
            };
            
            books.push(book);
        }
    }
    
    return books;
}

// Fallback books if Google Sheets fails
function getFallbackBooks() {
    return [
        {
            id: 1,
            title: "Beast Academy Math Workbook Level 1",
            author: "Enriches Lab",
            price: 24.99,
            category: "beast-academy",
            description: "Elementary school mathematics workbook for young learners.",
            image: "https://picsum.photos/seed/beast1/400/300",
            isbn: "978-0-7432-7356-1",
            stock: 15
        },
        {
            id: 2,
            title: "Beast Academy Math Workbook Level 2",
            author: "Enriches Lab",
            price: 24.99,
            category: "beast-academy",
            description: "Advanced elementary mathematics with problem-solving exercises.",
            image: "https://picsum.photos/seed/beast2/400/300",
            isbn: "978-0-7432-7356-2",
            stock: 12
        },
        {
            id: 3,
            title: "Introduction to Algebra",
            author: "AoPS",
            price: 49.99,
            category: "aops-series",
            description: "Comprehensive introduction to algebra for middle school students.",
            image: "https://picsum.photos/seed/algebra1/400/300",
            isbn: "978-0-7432-7356-3",
            stock: 8
        },
        {
            id: 4,
            title: "Introduction to Geometry",
            author: "AoPS",
            price: 54.99,
            category: "aops-series",
            description: "Fundamental concepts in geometry for high school students.",
            image: "https://picsum.photos/seed/geometry1/400/300",
            isbn: "978-0-7432-7356-4",
            stock: 10
        },
        {
            id: 5,
            title: "AMC 8 Preparation Guide",
            author: "Enriches Lab",
            price: 34.99,
            category: "math-contest",
            description: "Complete preparation guide for AMC 8 mathematics competition.",
            image: "https://picsum.photos/seed/amc8/400/300",
            isbn: "978-0-7432-7356-5",
            stock: 18
        }
    ];
}

// Alternative: Load books from a simple JSON file
function loadBooksFromJSON() {
    return [
        {
            id: 1,
            title: "Beast Academy Math Workbook Level 1",
            author: "Enriches Lab",
            price: 24.99,
            category: "beast-academy",
            description: "Elementary school mathematics workbook for young learners.",
            image: "https://picsum.photos/seed/beast1/400/300",
            isbn: "978-0-7432-7356-1",
            stock: 15
        },
        {
            id: 2,
            title: "Beast Academy Math Workbook Level 2",
            author: "Enriches Lab",
            price: 24.99,
            category: "beast-academy",
            description: "Advanced elementary mathematics with problem-solving exercises.",
            image: "https://picsum.photos/seed/beast2/400/300",
            isbn: "978-0-7432-7356-2",
            stock: 12
        }
        // Add more books here
    ];
}

// Initialize Google Sheets integration
async function initializeGoogleSheets() {
    const booksContainer = document.getElementById('productsGrid');
    
    // Show loading state briefly
    booksContainer.innerHTML = '<div class="loading">Loading books...</div>';
    
    try {
        // Try Google Sheets first
        const books = await loadBooks();
        
        // Update global books variable
        window.books = books;
        
        // Render books
        renderBooks(books);
        
        // Show cache info in console
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        if (timestamp) {
            console.log(`Books cached at: ${new Date(parseInt(timestamp)).toLocaleString()}`);
            console.log('To refresh books, call: refreshBooksFromGoogleSheets()');
        }
        
    } catch (error) {
        console.error('Failed to initialize books from Google Sheets:', error);
        console.log('Loading fallback books instead...');
        
        // Use fallback books
        const fallbackBooks = getFallbackBooks();
        window.books = fallbackBooks;
        renderBooks(fallbackBooks);
        
        // Show message to user
        booksContainer.innerHTML = '<div class="error">Using cached book data. Google Sheets access requires public sharing.</div>';
        setTimeout(() => {
            renderBooks(fallbackBooks);
        }, 3000);
    }
}

// Export functions for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadBooks,
        refreshBooksFromGoogleSheets,
        loadBooksFromCache,
        saveBooksToCache,
        initializeGoogleSheets,
        loadBooksFromJSON
    };
}

// Function to fetch products from Google Sheets API
function fetchProducts() {
    // Replace with your actual Google Sheets API URL from the deployment
    const apiUrl = 'https://script.google.com/macros/s/AKfycbztg6Ege1Xo_GzvSBcQUNgMGt5FL67wqlgn4I00_1B8s_O-nKPC2YnbVO2wgrB2ohc8/exec';
    
    // Show loading indicator
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '<div class="loading">Loading products...</div>';
    
    fetch(apiUrl)
        .then(response => {
            console.log('API Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Products loaded successfully:', data.length);
            window.allProducts = data;
            displayProducts('all');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productGrid.innerHTML = `<div class="error">Failed to load products: ${error.message}</div>`;
        });
}

// Function to format price in Mozambican Metical
function formatPrice(price) {
    return `MT ${Number(price).toFixed(2).replace('.', ',')}`;
}

// Function to create product cards and display them
function displayProducts(filterCategory = 'all') {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    // Make sure we have products loaded
    if (!window.allProducts || window.allProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No products available.</div>';
        return;
    }
    
    const filteredProducts = filterCategory === 'all' 
        ? window.allProducts 
        : window.allProducts.filter(product => product.category === filterCategory);
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<div class="no-products">No products found in category "${filterCategory}".</div>`;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        // Product HTML structure
        productCard.innerHTML = `
            ${product.isNew ? '<div class="product-tag">Novo</div>' : ''}
            ${!product.inStock ? '<div class="out-of-stock">Esgotado</div>' : ''}
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <div class="price">${formatPrice(product.price)}</div>
                <div class="sku">SKU: ${product.sku}</div>
                <div class="product-actions">
                <a href="https://api.whatsapp.com/message/W2GSSRCRV56XN1" class="whatsapp-btn" target="_blank">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
                    <a href="https://instagram.com/mercy__belle" class="instagram-btn" target="_blank">
                        <i class="fab fa-instagram"></i> Instagram
                    </a>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// Function to handle filter button clicks
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category from data attribute
            const filterCategory = this.getAttribute('data-filter');
            
            // Display products based on filter
            displayProducts(filterCategory);
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Fetch products from Google Sheets API
    fetchProducts();
    
    // Setup filter buttons
    setupFilterButtons();
    
    // Handle category links from the categories section
    const categoryLinks = document.querySelectorAll('.category-content .btn[data-filter]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default action of the link
            e.preventDefault();
            
            // Get the filter category
            const filterCategory = this.getAttribute('data-filter');
            
            // Scroll to the products section
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            
            // Set active filter button
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === filterCategory) {
                    btn.click();
                }
            });
        });
    });
});
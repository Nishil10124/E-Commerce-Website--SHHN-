console.clear();

// Local glasses products data
const glassesProducts = [
    {
        id: "g1",
        name: "Classic Black Wayfarer",
        brand: "Ray-Ban",
        price: 2499,
        preview: "img/spec1.webp",
        photos: ["img/spec1.webp"],
        description: "Classic black wayfarer sunglasses with UV protection",
        category: "glasses",
        isAccessory: true
    },
    {
        id: "g2",
        name: "Modern Square Frame",
        brand: "Oakley",
        price: 1999,
        preview: "img/spec2.webp",
        photos: ["img/spec2.webp"],
        description: "Modern square frame sunglasses with polarized lenses",
        category: "glasses",
        isAccessory: true
    },
    {
        id: "g3",
        name: "Designer Collection",
        brand: "John Jacobs",
        price: 2999,
        preview: "img/spec3.webp",
        photos: ["img/spec3.webp"],
        description: "Premium designer sunglasses with gradient lenses",
        category: "glasses",
        isAccessory: true
    },
    {
        id: "g4",
        name: "Sport Edition",
        brand: "Maui Jim",
        price: 3499,
        preview: "img/spec4.webp",
        photos: ["img/spec4.webp"],
        description: "Sports sunglasses with anti-glare coating",
        category: "glasses",
        isAccessory: true
    }
];

// Initialize cart data from localStorage or create new cart
let cartData = { items: [], counter: 0 };
try {
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) {
        cartData = JSON.parse(savedCart);
        console.log('Loaded cart data:', cartData);
    }
} catch (e) {
    console.error('Error parsing cart data:', e);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById("badge");
    if (badge) {
        badge.innerHTML = cartData.counter || 0;
    }
}

// Save cart data to localStorage
function saveCartData() {
    localStorage.setItem('cartData', JSON.stringify(cartData));
    updateCartBadge();
}

// Create cart item element
function createCartItem(product, quantity, size = null) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    // Product image
    const img = document.createElement('img');
    img.src = product.preview;
    img.alt = product.name;
    cartItem.appendChild(img);

    // Product details
    const details = document.createElement('div');
    details.className = 'item-details';
    
    const name = document.createElement('h3');
    name.textContent = product.name;
    details.appendChild(name);
    
    const brand = document.createElement('p');
    brand.textContent = product.brand;
    details.appendChild(brand);
    
    if (size) {
        const sizeText = document.createElement('p');
        // Add 'ml' suffix for perfumes
        if (product.type === 'perfume') {
            sizeText.textContent = `Size: ${size} ml`;
        } else {
            sizeText.textContent = `Size: ${size}`;
        }
        details.appendChild(sizeText);
    }
    
    cartItem.appendChild(details);

    // Quantity controls
    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'item-quantity';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'quantity-btn';
    decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
    decreaseBtn.onclick = () => updateQuantity(product.id, size, -1);
    
    const quantitySpan = document.createElement('span');
    quantitySpan.textContent = quantity;
    
    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'quantity-btn';
    increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
    increaseBtn.onclick = () => updateQuantity(product.id, size, 1);
    
    quantityDiv.appendChild(decreaseBtn);
    quantityDiv.appendChild(quantitySpan);
    quantityDiv.appendChild(increaseBtn);
    cartItem.appendChild(quantityDiv);

    // Price
    const price = document.createElement('div');
    price.className = 'item-price';
    price.textContent = `Rs. ${product.price * quantity}`;
    cartItem.appendChild(price);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.onclick = () => removeItem(product.id, size);
    cartItem.appendChild(removeBtn);

    return cartItem;
}

// Update item quantity
function updateQuantity(productId, size, change) {
    const itemIndex = cartData.items.findIndex(item => 
        item.id === productId && item.size === size
    );

    if (itemIndex !== -1) {
        const item = cartData.items[itemIndex];
        item.quantity = Math.max(1, item.quantity + change);
        
        if (item.quantity === 0) {
            cartData.items.splice(itemIndex, 1);
        }
        
        cartData.counter = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        saveCartData();
        renderCart();
    }
}

// Remove item from cart
function removeItem(productId, size) {
    cartData.items = cartData.items.filter(item => 
        !(item.id === productId && item.size === size)
    );
    cartData.counter = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    saveCartData();
    renderCart();
}

// Calculate total amount
function calculateTotal(items, productMap) {
    const total = items.reduce((total, item) => {
        const product = productMap.get(item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
    
    // Format total with commas for thousands
    return total.toLocaleString('en-IN');
}

// Render cart
function renderCart() {
    const cartContainer = document.getElementById('cartContainer');
    const totalContainer = document.getElementById('totalContainer');
    const totalAmount = document.getElementById('totalAmount');
    const totalItem = document.getElementById('totalItem');
    
    if (!cartContainer) return;

    // Clear previous content
    cartContainer.innerHTML = '';
    
    if (cartData.items.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <a href="index.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        totalContainer.style.display = 'none';
        return;
    }

    // Show total items
    totalItem.textContent = `Total Items: ${cartData.counter}`;
    totalContainer.style.display = 'block';

    // Fetch products from API
    fetch('https://5d76bf96515d1a0014085cf9.mockapi.io/product')
        .then(response => response.json())
        .then(apiProducts => {
            // Create product map
            const productMap = new Map();
            
            // Add API products
            apiProducts.forEach(product => {
                productMap.set(product.id.toString(), product);
            });
            
            // Add glasses products
            glassesProducts.forEach(glasses => {
                productMap.set(glasses.id, glasses);
            });

            // Render cart items
            cartData.items.forEach(item => {
                const product = productMap.get(item.id);
                if (product) {
                    const cartItem = createCartItem(product, item.quantity, item.size);
                    cartContainer.appendChild(cartItem);
                }
            });

            // Update total amount with formatted value
            const total = calculateTotal(cartData.items, productMap);
            totalAmount.textContent = `Rs. ${total}`;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error loading cart items</h3>
                    <p>Please try again later</p>
                </div>
            `;
        });
}

// Place order
function placeOrder() {
    if (cartData.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (!userData) {
        alert('Please login to place an order');
        window.location.href = 'login.html';
        return;
    }

    // Proceed to payment
    window.location.href = 'payment.html';
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderCart();
});





// Load cart data from cookie
let cartData = { items: [], counter: 0 };
try {
    if (document.cookie.indexOf('cartData=') >= 0) {
        let cookieValue = document.cookie.split('cartData=')[1];
        if (cookieValue.indexOf(';') !== -1) {
            cookieValue = cookieValue.split(';')[0];
        }
        cartData = JSON.parse(decodeURIComponent(cookieValue));
    }
} catch (e) {
    console.error('Error parsing cart data:', e);
}

// Update cart badge
let badge = document.getElementById("badge");
if (badge) {
    badge.innerHTML = cartData.counter || 0;
}

// Function to get product details based on ID and type
function getProductDetails(id, type) {
    if (type === 'perfume') {
        return perfumeData.find(p => p.id === id);
    } else if (type === 'glasses') {
        return glassesData.find(g => g.id === id);
    } else {
        // For clothing and accessories, fetch from API
        return new Promise((resolve, reject) => {
            let httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject('API call failed');
                    }
                }
            };
            httpRequest.open("GET", "https://5d76bf96515d1a0014085cf9.mockapi.io/product/" + id, true);
            httpRequest.send();
        });
    }
}

// Function to create cart item element
function createCartItemElement(product, cartItem) {
    let itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    let img = document.createElement('img');
    img.src = product.preview;
    img.alt = product.name;

    let detailsDiv = document.createElement('div');
    detailsDiv.className = 'item-details';

    let name = document.createElement('h3');
    name.textContent = product.name;

    let brand = document.createElement('p');
    brand.textContent = product.brand;

    let price = document.createElement('p');
    price.className = 'price';
    price.textContent = 'Rs. ' + product.price;

    let size = document.createElement('p');
    if (cartItem.size) {
        size.textContent = 'Size: ' + cartItem.size;
    }

    let removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeFromCart(cartItem);

    detailsDiv.appendChild(name);
    detailsDiv.appendChild(brand);
    detailsDiv.appendChild(price);
    if (cartItem.size) {
        detailsDiv.appendChild(size);
    }
    detailsDiv.appendChild(removeBtn);

    itemDiv.appendChild(img);
    itemDiv.appendChild(detailsDiv);

    return itemDiv;
}

// Function to remove item from cart
function removeFromCart(cartItem) {
    const index = cartData.items.findIndex(item => 
        item.id === cartItem.id && item.size === cartItem.size
    );
    if (index > -1) {
        cartData.items.splice(index, 1);
        cartData.counter = cartData.items.length;
        updateCart();
        saveToCookie();
    }
}

// Function to save cart data to cookie
function saveToCookie() {
    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = "cartData=" + encodeURIComponent(JSON.stringify(cartData)) + 
                     "; expires=" + date.toUTCString() + 
                     "; path=/";
    
    // Update badge
    let badges = document.querySelectorAll("#badge");
    badges.forEach(badge => {
        badge.innerHTML = cartData.counter;
    });
}

// Function to update cart display
async function updateCart() {
    const container = document.getElementById('cartContainer');
    container.innerHTML = '';
    let totalAmount = 0;

    for (let item of cartData.items) {
        let product;
        if (item.type === 'perfume' || item.type === 'glasses') {
            product = getProductDetails(item.id, item.type);
        } else {
            try {
                product = await getProductDetails(item.id, item.type);
            } catch (error) {
                console.error('Error fetching product:', error);
                continue;
            }
        }

        if (product) {
            container.appendChild(createCartItemElement(product, item));
            totalAmount += product.price;
        }
    }

    document.getElementById('totalAmount').textContent = totalAmount;
}

// Function to handle order placement
function placeOrder() {
    if (cartData.items.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Here you would typically integrate with a payment gateway
    alert('Order placed successfully!');
    
    // Clear cart after successful order
    cartData.items = [];
    cartData.counter = 0;
    saveToCookie();
    updateCart();
}

// Initialize cart display
updateCart(); 
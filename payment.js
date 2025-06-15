document.addEventListener('DOMContentLoaded', function() {
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

    // Get total amount from cookies with proper error handling
    let cartData = { items: [], counter: 0 };
    try {
        const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cartData='));
        if (cartCookie) {
            cartData = JSON.parse(decodeURIComponent(cartCookie.split('=')[1]));
            console.log('Cart data loaded:', cartData);
        } else {
            console.log('No cart cookie found');
        }
    } catch (e) {
        console.error('Error parsing cart data:', e);
    }

    const totalAmount = document.getElementById('totalAmount');
    if (!totalAmount) {
        console.error('totalAmount element not found');
        return;
    }
    
    // Fetch product details to calculate total
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if(this.readyState === 4) {
            if(this.status == 200) {
                let apiProducts = JSON.parse(this.responseText);
                console.log('API Products loaded:', apiProducts);

                // Create a map of all products (both API and glasses)
                let productMap = new Map();
                
                // Add API products to map
                apiProducts.forEach(product => {
                    productMap.set(product.id.toString(), product);
                });
                
                // Add glasses products to map
                glassesProducts.forEach(glasses => {
                    productMap.set(glasses.id, glasses);
                });
                
                let amount = 0;
                
                // Count occurrences of each item
                let itemGroups = {};
                cartData.items.forEach(item => {
                    let itemId, itemSize;
                    if (typeof item === 'object') {
                        itemId = item.id;
                        itemSize = item.size;
                    } else {
                        itemId = item;
                        itemSize = null;
                    }
                    
                    const key = itemId + (itemSize ? `-${itemSize}` : '');
                    if (!itemGroups[key]) {
                        itemGroups[key] = {
                            id: itemId,
                            size: itemSize,
                            count: 0
                        };
                    }
                    itemGroups[key].count++;
                });
                
                console.log('Item groups:', itemGroups);
                
                let orderSummaryHTML = '<p>Order Summary:</p>';
                
                // Calculate total amount considering quantity
                Object.values(itemGroups).forEach(group => {
                    let product = productMap.get(group.id);
                    
                    if (product) {
                        let itemTotal = Number(product.price) * group.count;
                        amount += itemTotal;
                        orderSummaryHTML += `
                            <div class="order-item">
                                <p>${product.name}${group.size ? ` (Size: ${group.size})` : ''} × ${group.count}</p>
                                <p>₹${itemTotal}</p>
                            </div>
                        `;
                        console.log(`Item ${group.id}: ${group.count} x ${product.price} = ${itemTotal}`);
                    }
                });
                
                console.log('Total amount calculated:', amount);
                
                totalAmount.innerHTML = `
                    ${orderSummaryHTML}
                    <div class="order-total">
                        <h3>Total Items: ${cartData.counter}</h3>
                        <h3>Total Amount: ₹${amount}</h3>
                    </div>
                `;
            } else {
                console.error('Failed to load products:', this.status);
            }
        }
    };
    
    httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
    httpRequest.send();

    // Show payment details based on selected payment method
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment details first
            document.querySelectorAll('.paymentDetails').forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Show selected payment method details
            if (this.checked && this.id !== 'cod') {
                document.getElementById(this.id + 'Details').style.display = 'block';
            }
        });
    });

    // Format expiry date input
    function formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        input.value = value;
    }

    // Add expiry date formatting to both credit and debit card expiry inputs
    ['credit', 'debit'].forEach(type => {
        const expiryInput = document.getElementById(type + 'ExpiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', function() {
                formatExpiryDate(this);
            });
        }
    });

    // Get the payment form
    const paymentForm = document.getElementById('paymentForm');
    
    // Add form submit event listener
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            
            // Get all form data
            const formData = {
                shipping: {
                    fullName: document.getElementById('fullName').value,
                    streetAddress: document.getElementById('streetAddress').value,
                    apartment: document.getElementById('apartment').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zipCode: document.getElementById('zipCode').value,
                    phone: document.getElementById('phone').value
                },
                paymentMethod: document.querySelector('input[name="payment"]:checked')?.value
            };

            // Validate shipping address
            for (const [key, value] of Object.entries(formData.shipping)) {
                if (key !== 'apartment' && !value) { // apartment is optional
                    const field = document.getElementById(key);
                    if (!field.checkValidity()) {
                        alert(field.title || 'Please fill in all required fields');
                        field.focus();
                        return false;
                    }
                }
            }

            // Validate payment method
            if (!formData.paymentMethod) {
                alert('Please select a payment method');
                return false;
            }

            // Validate payment details if not COD
            if (formData.paymentMethod !== 'cod') {
                const paymentDetails = document.getElementById(`${formData.paymentMethod}Details`);
                const inputs = paymentDetails.getElementsByTagName('input');
                
                for (let input of inputs) {
                    if (!input.checkValidity()) {
                        alert(input.title || 'Please fill in all payment details correctly');
                        input.focus();
                        return false;
                    }
                }
            }

            // If all validations pass, process the order
            processOrder(formData);
        });
    }

    function processOrder(formData) {
        // Show processing message
        const processingMessage = document.createElement('div');
        processingMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            text-align: center;
        `;
        processingMessage.innerHTML = `
            <h3>Processing Order...</h3>
            <p>Please do not refresh the page.</p>
        `;
        document.body.appendChild(processingMessage);

        // Simulate order processing
        setTimeout(() => {
            try {
                // Clear cart data
                let cartData = { items: [], counter: 0 };
                let date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                document.cookie = "cartData=" + encodeURIComponent(JSON.stringify(cartData)) + 
                                "; expires=" + date.toUTCString() + 
                                "; path=/";

                // Store order details if needed
                const orderDetails = {
                    ...formData,
                    orderDate: new Date().toISOString(),
                    orderId: 'ORD' + Date.now(),
                    status: 'confirmed'
                };
                
                // Store in localStorage for order history
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                orders.push(orderDetails);
                localStorage.setItem('orders', JSON.stringify(orders));

                // Redirect to order confirmation page
                window.location.href = 'orderPlaced.html';
            } catch (error) {
                console.error('Error processing order:', error);
                alert('There was an error processing your order. Please try again.');
                document.body.removeChild(processingMessage);
            }
        }, 2000); // 2 second delay to simulate processing
    }

    // Add input validation for card numbers (numbers only)
    function validateNumberInput(event) {
        if (!/^\d*$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            event.preventDefault();
        }
    }

    // Add number-only validation to card numbers, CVV, and phone
    ['creditCardNumber', 'debitCardNumber', 'creditCVV', 'debitCVV', 'phone', 'zipCode'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keydown', validateNumberInput);
        }
    });

    // Load total amount from localStorage or set default
    window.addEventListener('DOMContentLoaded', () => {
        const totalAmount = localStorage.getItem('totalAmount') || '0.00';
        document.getElementById('totalAmount').textContent = `Total Amount: ₹${totalAmount}`;
    });
}); 
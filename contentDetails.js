console.clear()

// Get product ID from URL with error handling
let id = '';
try {
    const searchParams = new URLSearchParams(window.location.search);
    id = searchParams.get('id');
    if (!id) {
        throw new Error('No product ID provided');
    }
    console.log('Product ID:', id);
} catch (error) {
    console.error('Error getting product ID:', error);
    // Redirect to home page if no valid ID
    window.location.href = 'index.html';
}

// Local glasses products data
const glassesProducts = [
    {
        id: "g1",
        name: "Classic Black Wayfarer",
        brand: "Ray-Ban",
        price: 2499,
        preview: "./img/spec1.webp",
        photos: ["./img/spec1.webp"],
        description: "Classic black wayfarer sunglasses with UV protection",
        category: "glasses",
        isGlasses: true
    },
    {
        id: "g2",
        name: "Modern Square Frame",
        brand: "Oakley",
        price: 1999,
        preview: "./img/spec2.webp",
        photos: ["./img/spec2.webp"],
        description: "Modern square frame sunglasses with polarized lenses",
        category: "glasses",
        isGlasses: true
    },
    {
        id: "g3",
        name: "Designer Collection",
        brand: "John Jacobs",
        price: 2999,
        preview: "./img/spec3.webp",
        photos: ["./img/spec3.webp"],
        description: "Premium designer sunglasses with gradient lenses",
        category: "glasses",
        isGlasses: true
    },
    {
        id: "g4",
        name: "Sport Edition",
        brand: "Maui Jim",
        price: 3499,
        preview: "./img/spec4.webp",
        photos: ["./img/spec4.webp"],
        description: "Sports sunglasses with anti-glare coating",
        category: "glasses",
        isGlasses: true
    }
];

// Local clothing products data
const clothingProducts = [
    {
        id: "c1",
        name: "Classic White T-Shirt",
        brand: "Nike",
        price: 999,
        preview: "./img/clothing1.webp",
        photos: ["./img/clothing1.webp"],
        description: "Premium cotton t-shirt with classic fit",
        category: "clothing",
        isClothing: true
    },
    {
        id: "c2",
        name: "Denim Jacket",
        brand: "Levi's",
        price: 2499,
        preview: "./img/clothing2.webp",
        photos: ["./img/clothing2.webp"],
        description: "Classic denim jacket with modern styling",
        category: "clothing",
        isClothing: true
    }
];

// Local accessories products data
const accessoriesProducts = [
    {
        id: "a1",
        name: "Leather Wallet",
        brand: "Fossil",
        price: 1499,
        preview: "./img/accessory1.webp",
        photos: ["./img/accessory1.webp"],
        description: "Genuine leather wallet with multiple card slots",
        category: "accessories",
        isAccessory: true
    },
    {
        id: "a2",
        name: "Silver Watch",
        brand: "Timex",
        price: 1999,
        preview: "./img/accessory2.webp",
        photos: ["./img/accessory2.webp"],
        description: "Classic silver watch with leather strap",
        category: "accessories",
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

function dynamicContentDetails(ob)
{
    let mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    document.getElementById('containerProduct').appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    let imgTag = document.createElement('img')
    imgTag.id = 'imgDetails'
    imgTag.src = ob.preview
    imgTag.alt = ob.name
    imgTag.onerror = function() {
        console.error('Failed to load image:', this.src);
        this.src = './img/placeholder.jpg'; // Fallback image
    }

    imageSectionDiv.appendChild(imgTag)

    let productDetailsDiv = document.createElement('div')
    productDetailsDiv.id = 'productDetails'

    let h1 = document.createElement('h1')
    let h1Text = document.createTextNode(ob.name)
    h1.appendChild(h1Text)

    let h4 = document.createElement('h4')
    let h4Text = document.createTextNode(ob.brand)
    h4.appendChild(h4Text)

    let detailsDiv = document.createElement('div')
    detailsDiv.id = 'details'

    let h3DetailsDiv = document.createElement('h3')
    let h3DetailsText = document.createTextNode('Rs ' + ob.price)
    h3DetailsDiv.appendChild(h3DetailsText)

    let h3 = document.createElement('h3')
    let h3Text = document.createTextNode('Description')
    h3.appendChild(h3Text)

    let para = document.createElement('p')
    let paraText = document.createTextNode(ob.description)
    para.appendChild(paraText)

    // Add size selection for clothing items
    if (!ob.isAccessory && !ob.isPerfume && !ob.isGlasses) {
        let sizeDiv = document.createElement('div')
        sizeDiv.id = 'sizeSelection'

        let sizeTitle = document.createElement('h3')
        sizeTitle.textContent = 'Select Size'
        sizeDiv.appendChild(sizeTitle)

        let sizeOptions = document.createElement('div')
        sizeOptions.className = 'size-options'

        const sizes = ['S', 'M', 'L', 'XL']
        let selectedSize = null

        sizes.forEach(size => {
            let sizeBtn = document.createElement('button')
            sizeBtn.className = 'size-btn'
            sizeBtn.textContent = size
            sizeBtn.onclick = function() {
                document.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active')
                })
                sizeBtn.classList.add('active')
                selectedSize = size
            }
            sizeOptions.appendChild(sizeBtn)
        })

        sizeDiv.appendChild(sizeOptions)
        productDetailsDiv.appendChild(sizeDiv)
    }
    // Add milliliter selection for perfumes
    else if (ob.isPerfume) {
        let sizeDiv = document.createElement('div')
        sizeDiv.id = 'sizeSelection'

        let sizeTitle = document.createElement('h3')
        sizeTitle.textContent = 'Select Size (ml)'
        sizeDiv.appendChild(sizeTitle)

        let sizeOptions = document.createElement('div')
        sizeOptions.className = 'size-options'

        const sizes = ['30', '50', '100']
        let selectedSize = null

        sizes.forEach(size => {
            let sizeBtn = document.createElement('button')
            sizeBtn.className = 'size-btn'
            sizeBtn.textContent = size + ' ml'
            sizeBtn.onclick = function() {
                document.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active')
                })
                sizeBtn.classList.add('active')
                selectedSize = size
            }
            sizeOptions.appendChild(sizeBtn)
        })

        sizeDiv.appendChild(sizeOptions)
        productDetailsDiv.appendChild(sizeDiv)
    }

    let productPreviewDiv = document.createElement('div')
    productPreviewDiv.id = 'productPreview'

    let h3ProductPreviewDiv = document.createElement('h3')
    let h3ProductPreviewText = document.createTextNode('Product Preview')
    h3ProductPreviewDiv.appendChild(h3ProductPreviewText)
    productPreviewDiv.appendChild(h3ProductPreviewDiv)

    // Create preview images container
    let previewImagesDiv = document.createElement('div')
    previewImagesDiv.className = 'preview-images'

    let i;
    for(i=0; i<ob.photos.length; i++) {
        let imgTagProductPreviewDiv = document.createElement('img')
        imgTagProductPreviewDiv.className = 'previewImg'
        imgTagProductPreviewDiv.src = ob.photos[i]
        imgTagProductPreviewDiv.alt = `${ob.name} - Preview ${i + 1}`
        imgTagProductPreviewDiv.onerror = function() {
            console.error('Failed to load preview image:', this.src);
            this.src = './img/placeholder.jpg'; // Fallback image
        }
        imgTagProductPreviewDiv.onclick = function() {
            imgTag.src = this.src;
            document.getElementById("imgDetails").src = this.src;
            
            // Update active state
            document.querySelectorAll('.previewImg').forEach(img => {
                img.classList.remove('active');
            });
            this.classList.add('active');
        }
        previewImagesDiv.appendChild(imgTagProductPreviewDiv)
    }
    productPreviewDiv.appendChild(previewImagesDiv)

    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'

    let buttonTag = document.createElement('button')
    buttonDiv.appendChild(buttonTag)

    buttonText = document.createTextNode('Add to Cart')
    buttonTag.onclick = function()
    {
        let selectedSize = null;
        let needsSize = false;

        // Check if size selection is needed based on product type
        if (!ob.isAccessory && !ob.isPerfume && !ob.isGlasses) {
            needsSize = true;
            selectedSize = document.querySelector('.size-btn.active')?.textContent;
        } else if (ob.isPerfume) {
            needsSize = true;
            const sizeBtn = document.querySelector('.size-btn.active');
            if (sizeBtn) {
                selectedSize = sizeBtn.textContent.replace(' ml', ''); // Remove 'ml' from the stored value
            }
        }

        // Validate size selection if needed
        if (needsSize && !selectedSize) {
            alert('Please select a size first!');
            return;
        }

        // Add item to cart with appropriate data
        const cartItem = {
            id: id,
            quantity: 1,
            type: ob.isPerfume ? 'perfume' : ob.isGlasses ? 'glasses' : ob.isAccessory ? 'accessory' : 'clothing'
        };

        if (selectedSize) {
            cartItem.size = selectedSize;
        }

        // Check if item already exists in cart
        const existingItemIndex = cartData.items.findIndex(item => 
            item.id === cartItem.id && item.size === cartItem.size
        );

        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            cartData.items[existingItemIndex].quantity += 1;
        } else {
            // Add new item
            cartData.items.push(cartItem);
        }

        // Update counter
        cartData.counter = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Save cart data
        saveCartData();

        // Show success message
        alert('Item added to cart successfully!');
    }
    buttonTag.appendChild(buttonText)

    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(productDetailsDiv)
    productDetailsDiv.appendChild(h1)
    productDetailsDiv.appendChild(h4)
    productDetailsDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(h3DetailsDiv)
    detailsDiv.appendChild(h3)
    detailsDiv.appendChild(para)
    productDetailsDiv.appendChild(productPreviewDiv)
    productDetailsDiv.appendChild(buttonDiv)

    return mainContainer
}

// Load product based on ID
function loadProduct() {
    console.log('Loading product with ID:', id);
    
    // Check if it's a glasses product
    if (id.startsWith('g')) {
        const product = glassesProducts.find(p => p.id === id);
        if (product) {
            console.log('Found glasses product:', product);
            dynamicContentDetails(product);
        } else {
            showError('Product not found');
        }
    }
    // Check if it's a perfume product
    else if (id.startsWith('p')) {
        const product = perfumeData.find(p => p.id === id);
        if (product) {
            console.log('Found perfume product:', product);
            dynamicContentDetails(product);
        } else {
            showError('Product not found');
        }
    }
    // Otherwise, fetch from API (clothing and accessories)
    else {
        console.log('Fetching product from API...');
        fetch(`https://5d76bf96515d1a0014085cf9.mockapi.io/product/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                return response.json();
            })
            .then(product => {
                console.log('API product data:', product);
                // Ensure photos array exists
                if (!product.photos) {
                    product.photos = [product.preview];
                }
                dynamicContentDetails(product);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                showError(error.message);
            });
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('containerProduct');
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// Call loadProduct when the page loads
document.addEventListener('DOMContentLoaded', loadProduct);

// Initialize cart badge and user account
function initializeHeader() {
    // Update cart badge
    updateCartBadge();

    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
        const userDataObj = JSON.parse(userData);
        const userLink = document.getElementById('userLink');
        const userName = document.getElementById('userName');
        if (userLink && userName) {
            userLink.href = 'profile.html';
            userName.textContent = userDataObj.name;
        }
    }
}

// Wait for header to load
function waitForHeader() {
    const header = document.getElementById('1');
    if (header && header.innerHTML.trim() !== '') {
        initializeHeader();
    } else {
        setTimeout(waitForHeader, 100);
    }
}

// Start checking for header
waitForHeader();  

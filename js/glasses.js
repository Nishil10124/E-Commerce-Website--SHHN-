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

// Function to create product cards
function createProductCard(product) {
    console.log('Creating card for product:', product); // Debug log
    let boxDiv = document.createElement("div");
    boxDiv.id = "box";

    let boxLink = document.createElement("a");
    boxLink.href = "contentDetails.html?id=" + product.id;

    let imgTag = document.createElement("img");
    imgTag.src = product.preview;
    console.log('Image path:', product.preview); // Debug log

    let detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    let h3 = document.createElement("h3");
    let h3Text = document.createTextNode(product.name);
    h3.appendChild(h3Text);

    let h4 = document.createElement("h4");
    let h4Text = document.createTextNode(product.brand);
    h4.appendChild(h4Text);

    let h2 = document.createElement("h2");
    let h2Text = document.createTextNode("Rs " + product.price);
    h2.appendChild(h2Text);

    boxDiv.appendChild(boxLink);
    boxLink.appendChild(imgTag);
    boxLink.appendChild(detailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(h4);
    detailsDiv.appendChild(h2);

    return boxDiv;
}

// Display glasses products
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Debug log
    let containerGlasses = document.getElementById("containerGlasses");
    console.log('Container element:', containerGlasses); // Debug log
    
    if (!containerGlasses) {
        console.error('Container element not found!');
        return;
    }

    // Display all glasses products
    glassesProducts.forEach(product => {
        containerGlasses.appendChild(createProductCard(product));
    });
    console.log('All products added to container'); // Debug log
}); 
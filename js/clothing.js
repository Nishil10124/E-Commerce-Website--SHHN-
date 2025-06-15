// Function to create product cards
function createProductCard(product) {
    let boxDiv = document.createElement("div");
    boxDiv.id = "box";

    let boxLink = document.createElement("a");
    boxLink.href = "contentDetails.html?id=" + product.id;

    let imgTag = document.createElement("img");
    imgTag.src = product.preview;

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

// Fetch products from API
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status == 200) {
        let products = JSON.parse(this.responseText);
        let containerClothing = document.getElementById("containerClothing");
        
        // Filter and display only clothing items (where isAccessory is false)
        products.forEach(product => {
            if (!product.isAccessory) {
                containerClothing.appendChild(createProductCard(product));
            }
        });
    }
};

httpRequest.open("GET", "https://5d76bf96515d1a0014085cf9.mockapi.io/product", true);
httpRequest.send(); 
// Add debugging
console.log('Content.js loading...');

// Verify data files are loaded
console.log('Checking data:', {
    perfumeData: typeof perfumeData !== 'undefined' ? 'loaded' : 'not loaded',
    glassesData: typeof glassesData !== 'undefined' ? 'loaded' : 'not loaded'
});

let contentTitle;

console.log(document.cookie);
function dynamicClothingSection(ob) {
  console.log('Creating element for:', ob);
  
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  boxLink.href = "contentDetails.html?id=" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.preview;
  
  // Add error handling for images
  imgTag.onerror = function() {
    console.error('Error loading image:', ob.preview);
    // Try to reload the image
    this.src = ob.preview + '?reload=' + new Date().getTime();
  };
  
  imgTag.onload = function() {
    console.log('Image loaded successfully:', ob.preview);
  };

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("rs  " + ob.price);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");
let containerPerfumes = document.getElementById("containerPerfumes");
let containerGlasses = document.getElementById("containerGlasses");

// Log container elements
console.log('Container elements:', {
    mainContainer: mainContainer ? 'found' : 'not found',
    containerClothing: containerClothing ? 'found' : 'not found',
    containerAccessories: containerAccessories ? 'found' : 'not found',
    containerPerfumes: containerPerfumes ? 'found' : 'not found',
    containerGlasses: containerGlasses ? 'found' : 'not found'
});

// BACKEND CALLING FOR CLOTHING AND ACCESSORIES
let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);
      if (document.cookie.indexOf(",counter=") >= 0) {
        var counter = document.cookie.split(",")[1].split("=")[1];
        document.getElementById("badge").innerHTML = counter;
      }
      
      // Process API data for clothing and accessories
      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isAccessory) {
          console.log("Accessory:", contentTitle[i]);
          if (containerAccessories) {
          containerAccessories.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
          }
        } else {
          console.log("Clothing:", contentTitle[i]);
          if (containerClothing) {
          containerClothing.appendChild(
            dynamicClothingSection(contentTitle[i])
          );
          }
        }
      }
    } else {
      console.log("API call failed!");
    }
  }
};

// Load perfume data if container exists
if (containerPerfumes && typeof perfumeData !== 'undefined') {
  console.log('Loading perfume data...');
  perfumeData.forEach(perfume => {
    containerPerfumes.appendChild(dynamicClothingSection(perfume));
  });
}

// Load glasses data if container exists
if (containerGlasses && typeof glassesData !== 'undefined') {
  console.log('Loading glasses data...');
  console.log('Glasses data:', glassesData);
  glassesData.forEach(glasses => {
    console.log('Creating element for glasses:', glasses);
    containerGlasses.appendChild(dynamicClothingSection(glasses));
  });
}

// Make API call for clothing and accessories
httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();

console.log('Content.js loaded successfully!');

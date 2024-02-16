const divFlexCol = document.createElement("div");
divFlexCol.className = "col-md-4 mt-2";

const divElement = document.createElement("div");
divElement.className = "card text-center mx-auto";

const h5Element = document.createElement("h5");
h5Element.className = "card-title";
h5Element.innerText = `${item.itemName}`;

const imgElement = document.createElement("img");
imgElement.className = "card-img-top";
imgElement.src = "../Images/coffecup.jpg";
imgElement.alt = "...";
imgElement.src = item.imageSource;
imgElement.alt = item.imageAlt;

const cardBody1 = document.createElement("div");
cardBody1.className = "card-body";

const pElement = document.createElement("p");
pElement.className = "card-text";
pElement.innerText = `Price: ${item.price}`;

const cardBody2 = document.createElement("div");
cardBody2.className = "card-body";

const addButton = document.createElement("button");
addButton.type = "button";
addButton.className = "btn btn-outline-success border me-1";
addButton.innerText = "Add";
addButton.setAttribute("onclick", `addProductToCart('${item.itemName}')`);

const infoButton = document.createElement("button");
infoButton.className = "btn btn-outline-primary ms-1";
infoButton.innerText = "Info";
infoButton.setAttribute("data-bs-toggle", "modal");
infoButton.setAttribute("data-bs-target", `#myLittleModal_${item.itemName}`);

divElement.appendChild(h5Element);
divElement.appendChild(imgElement);
divElement.appendChild(cardBody1);
cardBody1.appendChild(pElement);
divElement.appendChild(cardBody2);
cardBody2.appendChild(addButton);
cardBody2.appendChild(infoButton);
divFlexCol.appendChild(divElement);
rowOfItems.appendChild(divFlexCol);

const cartModalFade = document.createElement("div");
cartModalFade.id = "myCartModal";
cartModalFade.className = "modal fade";
cartModalFade.ariaHidden = "true";

const cartModalDialog = document.createElement("div");
cartModalDialog.className = "modal-dialog";

const cartModalContent = document.createElement("div");
cartModalContent.className = "modal-content";

const cartModalHeader = document.createElement("div");
cartModalHeader.className = "modal-header";

const cartModalTitle = document.createElement("h5");
cartModalTitle.className = "modal-title";
cartModalTitle.innerText = `Cart`;

const cartCloseTopRight = document.createElement("button");
cartCloseTopRight.className = "btn-close";
cartCloseTopRight.type = "button";
cartCloseTopRight.setAttribute("data-bs-dismiss", "modal");
cartCloseTopRight.ariaLabel = "Close";

const cartModalBody = document.createElement("div");
cartModalBody.className = "modal-body";
cartModalBody.id = "cartModalBody";
cartModalBody.innerText = "Empty"; //<---------------------Ändra vid Add / Remove

const cartModalFooter = document.createElement("div");
cartModalFooter.className = "modal-footer";

const cartTotalP = document.createElement("p");

const emptyCartButtonModal = document.createElement("button");
emptyCartButtonModal.type = "button";
emptyCartButtonModal.className = "btn btn-danger";
emptyCartButtonModal.setAttribute("onclick", `ClearCart()`);
emptyCartButtonModal.innerText = "Clear cart";

const cartDiv = document.getElementById("cartModalDiv");

cartDiv.appendChild(cartModalFade);
cartModalFade.appendChild(cartModalDialog);
cartModalDialog.appendChild(cartModalContent);
cartModalContent.appendChild(cartModalHeader);
cartModalHeader.appendChild(cartModalTitle);
cartModalHeader.appendChild(cartCloseTopRight);
cartModalContent.appendChild(cartModalBody);
cartModalContent.appendChild(cartModalFooter);
cartModalFooter.appendChild(cartTotalP);
cartModalFooter.appendChild(emptyCartButtonModal);

const tableConst = document.createElement("table");
tableConst.className = "table";
const theadConst = document.createElement("thead");
const trTheadConst = document.createElement("tr");
const nameTh = document.createElement("th");
const priceTh = document.createElement("th");
const amountTh = document.createElement("th");
const totalTh = document.createElement("th");
const removeTh = document.createElement("th");
nameTh.setAttribute("scope", "col");
nameTh.innerText = "Product";
priceTh.setAttribute("scope", "col");
priceTh.innerText = "Price";
amountTh.setAttribute("scope", "col");
amountTh.innerText = "Amount";
totalTh.setAttribute("scope", "col");
totalTh.innerText = "Total";
removeTh.setAttribute("scope", "col");
removeTh.innerText = "Remove";

const tbodyConst = document.createElement("tbody");

cartModalBody.appendChild(tableConst);
tableConst.appendChild(theadConst);
theadConst.appendChild(trTheadConst);
trTheadConst.appendChild(nameTh);
trTheadConst.appendChild(priceTh);
trTheadConst.appendChild(amountTh);
trTheadConst.appendChild(totalTh);
trTheadConst.appendChild(removeTh);
tableConst.appendChild(tbodyConst);

async function populateTableRows() {
  const new_tbody = document.createElement("tbody");
  tableConst.children[1].parentElement.replaceChild(
    new_tbody,
    tableConst.children[1]
  );

  let totalCounter = 0;
  let totalUSDCounter = 0;

  const tempArray = [];
  for (const arrayItem of cartItems) {
    //<---------------------Letar ändå igenom duplicerade items, om t.ex. 1 och 2 är samma.
    const foundItem = allItems.find((s) => s.itemName == arrayItem);
    console.log(foundItem);

    if (tempArray.includes(arrayItem)) {
      continue;
    }

    let b = cartItems.filter((d) => d == foundItem.itemName);
    foundItem.amount = b.length;

    tempArray.push(arrayItem);

    const total = foundItem.price * foundItem.amount;
    let priceInUSD = 0;

    let usdRate = await getUSDRate();
    let sekRate = await getSEKRate();

    console.log(usdRate);

    async function getSEKRate() {
      const response = await fetch("https://api.frankfurter.app/latest");
      const movies = await response.json();
      const sek = movies.rates.SEK;
      return sek;
    }

    async function getUSDRate() {
      const response = await fetch("https://api.frankfurter.app/latest");
      const movies = await response.json();
      const usd = movies.rates.USD;
      return usd;
    }

    priceInUSD = (usdRate / sekRate) * foundItem.price;

    const priceInUSDRounded = priceInUSD.toFixed(2);
    const totalInUSDRounded = ((usdRate / sekRate) * total).toFixed(2);

    totalCounter += total;
    totalUSDCounter += priceInUSD;
    console.log(priceInUSD);

    const newRecord = document.createElement("tr");
    const newNameDoc = document.createElement("td");
    const newPriceDoc = document.createElement("td");
    const newAmountDoc = document.createElement("td");
    const newTotalDoc = document.createElement("td");
    const newRemoveBtn = document.createElement("button");

    newNameDoc.innerText = arrayItem;
    newPriceDoc.innerText = `${foundItem.price} SEK / ${priceInUSDRounded} USD`;
    newAmountDoc.innerText = foundItem.amount;
    newTotalDoc.innerText = `${total} SEK / ${totalInUSDRounded} USD`;
    newRemoveBtn.innerText = "Remove";
    newRemoveBtn.type = "button";
    newRemoveBtn.className = "btn bg-danger text-white";
    newRemoveBtn.setAttribute(
      "onclick",
      `removeProductFromCart('${foundItem.itemName}')`
    );

    new_tbody.appendChild(newRecord);
    newRecord.appendChild(newNameDoc);
    newRecord.appendChild(newPriceDoc);
    newRecord.appendChild(newAmountDoc);
    newRecord.appendChild(newTotalDoc);
    newRecord.appendChild(newRemoveBtn);
  }
  const cartTotalUSD = totalUSDCounter.toFixed(2);
  cartTotalP.innerText = `Total: ${totalCounter} SEK / ${cartTotalUSD}USD`;
}

const clicks = 0;
let cartItems = [];

function ClearCart() {
  cartItems = [];
  populateTableRows();
}

function addProductToCart(fItemName) {
  cartItems.push(fItemName);

  populateTableRows();
}
//#region RemoveProductFromCart
function removeProductFromCart(a) {
  if (cartItems.length != 0) {
    let index = cartItems.indexOf(a);

    if (index < 0) {
      alert(`No such item in your cart`);
      return;
    }

    let deletedProduct = cartItems.splice(index, 1);
    alert(`You removed ${deletedProduct}`);
    populateTableRows();
  }
}
//#endregion
//#region Items-array
const allItems = [
  {
    itemName: "Speaker",
    description: `Really nice speaker <br />
                Dimensions: 6 x 3 x 2 inches <br />
                Specifications: Wireless connectivity, 10 hours of battery life,
                waterproof`,
    price: 319,
    imageSource: "..\\Images\\btSpeaker.jpg",
    imageAlt: "btSpeaker.jpg",
    amount: 0,
  },
  {
    itemName: "Coffe-cup",
    description: `Really nice cup <br />Dimensions: 3.5 inches in diameter, <br />
                4.5 inches in height <br />
                Specifications: Ceramic material, 12 oz capacity, microwave, and
                dishwasher safe`,
    price: 79,
    imageSource: "..\\Images\\coffecup.jpg",
    imageAlt: "coffecup.jpg",
    amount: 0,
  },
  {
    itemName: "Lamp",
    description: `Really nice lamp <br />
                Dimensions: 10 x 5 x 18 inches <br />Specifications: LED light,
                adjustable arm and brightness levels, USB charging ports`,
    price: 169,
    imageSource: "..\\Images\\desklamp.jpg",
    imageAlt: "desklamp.jpg",
    amount: 0,
  },
  {
    itemName: "Rubber-band",
    description: `Really nice rubber band <br />Dimensions: 5 feet in length, 2
                inches in width <br />Specifications: Heavy resistance level,
                durable latex material`,
    price: 99,
    imageSource: "..\\Images\\fitnessBand.jpg",
    imageAlt: "fitnessBand.jpg",
    amount: 0,
  },
  {
    itemName: "Backpack",
    description: `Really nice backpack <br />Dimensions: 18 x 12 x 6 inches
                <br />Specifications: Padded laptop compartment (fits up to
                15-inch laptops), multiple pockets for organization,
                water-resistant material`,
    price: 139,
    imageSource: "..\\Images\\laptopBackpack.jpg",
    imageAlt: "laptopBackpack.jpg",
    amount: 0,
  },
  {
    itemName: "Notebook",
    description: `Really nice notebook <br />Dimensions: 8.5 x 11 inches
                <br />Specifications: 100 pages, college-ruled, durable
                cardboard cover`,
    price: 19,
    imageSource: "..\\Images\\notebook.jpg",
    imageAlt: "notebook.jpg",
    amount: 0,
  },
  {
    itemName: "Pillow",
    description: `Pretty soft pillow
                <br />Dimensions: 18 x 18 inches<br />
                Specifications: <br />Cotton cover, hypoallergenic filling,
                removable and machine washable`,
    price: 59,
    imageSource: "..\\Images\\pillow.jpg",
    imageAlt: "pillow.jpg",
    amount: 0,
  },
  {
    itemName: "Plant-pot",
    description: `Really sturdy plant pot<br />
                Dimensions: 6 inches in diameter, 5 inches in height <br />
                Specifications: Ceramic material, drainage hole, suitable for
                small houseplants`,
    price: 29,
    imageSource: "..\\Images\\pot.jpg",
    imageAlt: "pot.jpg",
    amount: 0,
  },
  {
    itemName: "Smartphone",
    description: `Very cool phone<br />
                Dimensions: 5.8 x 2.7 x 0.3 inches. <br />Specifications: LED
                display, single-camera system, 512MB storage capacity.`,
    price: 249,
    imageSource: "..\\Images\\smartphone.jpg",
    imageAlt: "smartphone.jpg",
    amount: 0,
  },
  {
    itemName: "Sunglasses",
    description: `Woah! Mr-cool-guy! <br />
                Dimensions: 5.5 inches in width, 2 inches in height <br />
                Specifications: UV protection, polarized lenses (sort of),
                robust frame`,
    price: 109,
    imageSource: "..\\Images\\sunglasses.jpg",
    imageAlt: "sunglasses.jpg",
    amount: 0,
  },
];
//#endregion

const rowOfItems = document.getElementById("itemRow");

//#region for-of-loop
for (const item of allItems) {
  const cartModalFade = document.createElement("div");
  cartModalFade.id = `myLittleModal_${item.itemName}`;
  cartModalFade.className = "modal fade";
  cartModalFade.ariaHidden = "true";

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";

  const cartModalTitle = document.createElement("h5");
  cartModalTitle.className = "modal-title";
  cartModalTitle.innerText = `${item.itemName}`;

  const cartCloseTopRight = document.createElement("button");
  cartCloseTopRight.className = "btn-close";
  cartCloseTopRight.type = "button";
  cartCloseTopRight.setAttribute("data-bs-dismiss", "modal");
  cartCloseTopRight.ariaLabel = "Close";

  const cartModalBody = document.createElement("div");
  cartModalBody.className = "modal-body";
  cartModalBody.innerText = `${item.description}`;

  const cartModalFooter = document.createElement("div");
  cartModalFooter.className = "modal-footer";

  // const emptyCartButtonModal = document.createElement("button");
  // emptyCartButtonModal.type = "button";
  // emptyCartButtonModal.className = "btn btn-secondary";
  // emptyCartButtonModal.setAttribute(
  //   "onclick",
  //   `addProductToCart('${item.itemName}')`
  // );
  // emptyCartButtonModal.innerText = "Add";

  rowOfItems.appendChild(cartModalFade);
  cartModalFade.appendChild(modalDialog);
  modalDialog.appendChild(modalContent);
  modalContent.appendChild(modalHeader);
  modalHeader.appendChild(cartModalTitle);
  modalHeader.appendChild(cartCloseTopRight);
  modalContent.appendChild(cartModalBody);
  modalContent.appendChild(cartModalFooter);
  cartModalFooter.appendChild(emptyCartButtonModal);

  // const divFlexCol = document.createElement("div");
  // const divImageWrap = document.createElement("div");
  // const imgElement = document.createElement("img");
  // const divTextAndButtonContainer = document.createElement("div");
  // const paragraphDescription = document.createElement("p");
  // const testDiv = document.createElement("div");

  // divFlexCol.className = "flex col-sm-4";
  // divImageWrap.className = "imageWrap";
  // divTextAndButtonContainer.className = "textAndButtonContainer";

  // imgElement.src = item.imageSource;
  // imgElement.alt = item.imageAlt;
  // imgElement.className = "img-responsive";

  // const infoButton = document.createElement("button");
  // infoButton.type = "button";
  // infoButton.className = "btn btn-primary";
  // infoButton.setAttribute("data-bs-toggle", "modal");
  // infoButton.setAttribute("data-bs-target", `#myLittleModal_${item.itemName}`);
  // infoButton.innerText = "More info";

  // const productPriceDisplay = document.createElement("p");
  // productPriceDisplay.innerText = `Price: ${item.price}`;

  // rowOfItems.appendChild(divFlexCol);
  // divFlexCol.appendChild(divImageWrap);
  // divImageWrap.appendChild(imgElement);
  // divImageWrap.appendChild(divTextAndButtonContainer);
  // divTextAndButtonContainer.appendChild(productPriceDisplay);
  // divTextAndButtonContainer.appendChild(infoButton);
  // divTextAndButtonContainer.appendChild(paragraphDescription);

  const divFlexCol = document.createElement("div");
  divFlexCol.className = "flex col-sm-4 mb-2 ";

  const divElement = document.createElement("div");
  divElement.className = "card text-center align-content-center";
  divElement.style.width = "18rem";

  const h5Element = document.createElement("h5");
  h5Element.className = "card-title";
  h5Element.innerText = `${item.itemName}`;

  const imgElement = document.createElement("img");
  imgElement.className = "card-img-top";
  imgElement.src = "../Images/coffecup.jpg";
  imgElement.alt = "...";
  imgElement.src = item.imageSource;
  imgElement.alt = item.imageAlt;
  imgElement.className = "img-responsive";

  const cardBody1 = document.createElement("div");
  cardBody1.className = "card-body";

  const pElement = document.createElement("p");
  pElement.className = "card-text";
  pElement.innerText = `Price: ${item.price}`;

  const cardBody2 = document.createElement("div");
  cardBody2.className = "card-body";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "btn btn-outline-success border";
  addButton.innerText = "Add";
  addButton.setAttribute("onclick", `addProductToCart('${item.itemName}')`);

  const infoButton = document.createElement("button");
  infoButton.className = "btn btn-outline-primary";
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
}

//#endregion

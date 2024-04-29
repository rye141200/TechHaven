"use strict";
//! Elements
const profileBox = document.querySelector(".profile-box");
const inventoryDiv = document.querySelector(".inventory-mode");
const historyDiv = document.querySelector(".history-mode");
const historyBtn = document.querySelector(".refresh-icon");
const inventoryBtn = document.querySelector(".inventory-icon");
const editBtn = document.querySelectorAll(".market-btn");
const addNewItemBtn = document.querySelector(".add-btn");

let currentPrice;
let currentDiscretion;
let currentCategory;
let currentImage;
let currentQuantity;
let currentID;
let file;
let isEdited = false;

//! Methods
const editItem = function (btn) {
  isEdited = true;
  currentPrice = btn.parentNode.querySelector(".product-price").textContent;
  currentQuantity =
    btn.parentNode.querySelector(".product_quantity").textContent;
  currentID = btn.parentNode.querySelector(".product_id").textContent;
  currentDiscretion = btn.parentNode.querySelector(
    ".product-description"
  ).textContent;
  currentCategory =
    btn.parentNode.querySelector(".product-category").textContent;
  currentImage = btn.parentNode
    .querySelector(".product-image")
    .getAttribute("src");
  const btnParent = btn.parentNode;
  btnParent.innerHTML = "";
  const editModeHTML = `
    <div class="upload-image">
    <input type="file"  class="inputfile" accept="image/*"/>
    <ion-icon class="upload-icon" name="add-circle-outline"></ion-icon>
  </div>
  <input class="item-new-category edit-item-hover" type = "text" placeholder="Category:phone" maxlength="30">
  <textarea class="item-new-description edit-item-hover" placeholder="Description" rows="3" cols="50"></textarea>
  <input class="item-new-price edit-item-hover"type = "text" placeholder="Price:xxx" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);">
  <input class="item-new-quantity edit-item-hover" type= "text" placeholder="Quantity:x" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);">
  <div class="edit-mode ">
    <button class="save-changes prouct-buy ">Save</button>
    <ion-icon class="cancel-edit-btn" name="close-circle-outline"></ion-icon>
    </div>
  </div>`;
  btnParent.insertAdjacentHTML("beforeend", editModeHTML);
  btnParent.querySelector(".item-new-category").value = currentCategory;
  btnParent.querySelector(".item-new-description").textContent =
    currentDiscretion.trim();
  btnParent.querySelector(".item-new-quantity ").value = currentQuantity;
  if (currentImage.includes("\\")) {
    // Replace backslashes with forward slashes
    currentImage = currentImage.replace(/\\/g, "/");
  }
  btnParent.querySelector(
    ".upload-image"
  ).style.backgroundImage = `url(${currentImage})`;

  btnParent.querySelector(".item-new-price").value = currentPrice.replace(
    new RegExp(/\$/),
    ""
  );
  const saveBtn = btnParent
    .querySelector(".edit-mode")
    .querySelector(".save-changes");
  saveBtn.addEventListener("click", () => saveEdit(saveBtn));
};
//! exit the edit mode with no changes
const cancelEdit = function (
  btn,
  oldPrice,
  oldDescription,
  oldCategory,
  oldSrc,
  oldQuan,
  oldId
) {
  const theItemDiv = btn.parentNode.parentNode;
  theItemDiv.innerHTML = "";
  const cancelEdit = ` <img
    class="product-image"
    src="${oldSrc}"
  />
  <h1 class="product-category">${oldCategory}</h1>
  <p class="product-description">
    ${oldDescription}
  </p>
  <h1 class="product-price">${oldPrice}</h1>
  <h1 class="product_quantity product-price">${oldQuan}</h1>
  <h1 class="product_id product-price hidden">${oldId}</h1>
  <button class="market-btn product-buy">Edit!</button>
  <ion-icon  class="trash " name="trash-outline"></ion-icon>
  `;

  theItemDiv.innerHTML = cancelEdit;
  isEdited = false;
};
const deleteItem = function (btn, id) {
  btn.parentNode.parentNode.remove();
  fetch("/inventory", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
    .then((result) => {})
    .catch((err) => {});
  isEdited = false;
};
const addNewItem = function (btn) {
  const newDivItem = document.createElement("div");
  const newItemCategory = btn.querySelector(".item-new-category").value;
  const newItemDescription = btn.querySelector(".item-new-description").value;
  const newItemPrice = btn.querySelector(".item-new-price").value;
  const newItemQuantity = btn.querySelector(".item-new-quantity").value;
  let thenewID;
  const formData = new FormData();
  formData.append("newItemCategory", newItemCategory);
  formData.append("newItemDescription", newItemDescription);
  formData.append("newItemPrice", newItemPrice);
  formData.append("newItemQuantity", newItemQuantity);
  formData.append("image", file);
  let newItem;
  const newPhoto = window
    .getComputedStyle(btn.querySelector(".upload-image"))
    .getPropertyValue("background-image")
    .replace(/^url\(['"]?(.*?)['"]?\)$/, "$1");
  newItem = `
    <div class="product-grid-card">
    <img
      class="product-image"
      src="${newPhoto}"
    />
    <h1 class="product-category">${newItemCategory}</h1>
    <p class="product-description">
      ${newItemDescription}
    </p>
    <h1 class="product-price">${newItemPrice}$</h1>
    <h1 class="product_quantity product-price">${newItemQuantity}</h1>
    <h1 class="product_id product-price hidden"></h1>
    <button class="market-btn product-buy">Edit!</button>
    <ion-icon  class="trash " name="trash-outline"></ion-icon>
  </div>`;
  newDivItem.classList.add("inventory-item");
  if (newItemCategory != "" && newItemDescription != "" && newItemPrice != "") {
    newDivItem.innerHTML = newItem;
    inventoryDiv.insertBefore(newDivItem, btn.parentNode);
  }
  //TODO fetch the url from the background-image of the div
  //TODO const newItemImage????
  if (newItemCategory && newItemDescription && newItemPrice && newPhoto) {
    fetch("/inventory", {
      method: "POST",
      body: formData,
    })
      .then((result) => {
        return result.json();
      })
      .then((result) => {
        newDivItem.querySelector(".product_id").textContent = result.body.uuid;
      })
      .catch();
  }
  //! to reset the edit elements
  btn.querySelector(".item-new-category").value = "";
  btn.querySelector(".item-new-description").value = "";
  btn.querySelector(".item-new-price").value = "";
  btn.querySelector(".item-new-quantity").value = "";
  btn.querySelector(".upload-image").style.backgroundImage = "";
};

const saveEdit = function (btn) {
  const btnParent = btn.parentNode.parentNode;
  const newCategory = btnParent.querySelector(".item-new-category").value;
  const newDescription = btnParent.querySelector(".item-new-description").value;
  const newPrice = btnParent.querySelector(".item-new-price").value;
  const newQuantity = btnParent.querySelector(".item-new-quantity").value;

  const newPhoto = window
    .getComputedStyle(btnParent.querySelector(".upload-image"))
    .getPropertyValue("background-image")
    .replace(/^url\(['"]?(.*?)['"]?\)$/, "$1");
  btnParent.innerHTML = "";
  const editedHTML = `<img
    class="product-image"
    src="${newPhoto}"
  />
  <h1 class="product-category">${newCategory}</h1>
  <p class="product-description">
    ${newDescription}
  </p>
  <h1 class="product-price">${new Number(newPrice)}$</h1>
  <h1 class="product_quantity product-price">${newQuantity}</h1>
  <h1 class="product_id product-price hidden">${currentID}</h1>
  <button class="market-btn product-buy">Edit!</button>
  <ion-icon class="trash" name="trash-outline"></ion-icon>
  `;

  btnParent.innerHTML = editedHTML;

  const formData = new FormData();
  formData.append("newItemCategory", newCategory);
  formData.append("newItemDescription", newDescription);
  formData.append("newItemPrice", newPrice);
  formData.append("newItemQuantity", newQuantity);
  formData.append("ID", currentID);
  formData.append("image", file);

  fetch("/inventory", {
    method: "PATCH",
    body: formData,
  })
    .then((result) => {})
    .catch((err) => {});
  isEdited = false;
};

const uploadImage = function (btn) {
  const parentDiv = btn.parentNode;

  if (btn.files.length) {
    file = btn.files[0];
    parentDiv.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  }
};
//! to slide down the history items

//! Event handler

//? change modes
historyBtn.addEventListener("click", () => {
  if (inventoryBtn.classList.contains("hidden") == false) {
    historyBtn.classList.add("active-option");
    inventoryBtn.classList.remove("active-option");
    inventoryDiv.classList.add("hidden");
    historyDiv.classList.remove("hidden");
  }
});

inventoryBtn.addEventListener("click", () => {
  if (historyBtn.classList.contains("hidden") == false) {
    inventoryBtn.classList.add("active-option");
    historyBtn.classList.remove("active-option");
    historyDiv.classList.add("hidden");
    inventoryDiv.classList.remove("hidden");
  }
});
//? change modes
//? edit the item

document.addEventListener("click", (event) => {
  const target = event.target;
  //# Check if the clicked element is the edit button or within its descendant
  if (target.classList.contains("market-btn")) {
    if (!isEdited) editItem(target);
  } else if (target.classList.contains("inputfile")) {
    target.addEventListener("change", () => uploadImage(target), false);
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("cancel-edit-btn")) {
    cancelEdit(
      target,
      currentPrice,
      currentDiscretion,
      currentCategory,
      currentImage,
      currentQuantity,
      currentID
    );
  }
  if (target.classList.contains("trash")) {
    const target = event.target;
    const uuid = target.parentNode.querySelector(".product_id").textContent;
    deleteItem(target, uuid);
  }
});

addNewItemBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addNewItem(addNewItemBtn.parentNode);
});

function handleIconClick(event) {
  const icon = event.target.closest(".slide-down-icon");
  if (icon) {
    const parentItem = icon.closest(".order-items");
    if (parentItem) {
      const otherItems = parentItem.querySelectorAll(
        ".inventory-item.history-item:not(:first-child)"
      );
      const isOpen = otherItems[0].style.display !== "none";

      otherItems.forEach((item) => {
        item.style.display = isOpen ? "none" : "block";
      });
      icon.classList.toggle("rotated", !isOpen);
    }
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("slide-down-icon")) {
    handleIconClick(event);
  }
});

//# This code will handle click events for any element with the "market-btn" class,
//# including dynamically added elements, without needing to attach individual listeners to each one.
//? edit the item

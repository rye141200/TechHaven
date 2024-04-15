"use strict"
//! Elements
const profileBox = document.querySelector(".profile-box");
const inventoryDiv = document.querySelector(".inventory-mode");
const historyDiv = document.querySelector(".history-mode"); 
const historyBtn = document.querySelector(".refresh-icon");
const inventoryBtn = document.querySelector(".inventory-icon");
const editBtn = document.querySelectorAll(".market-btn");
const addNewItemBtn = document.querySelector(".add-btn");

let currentPrice;
let currentDiscrition;
let currentCategory;
let currentImage;

//! Methods
const editItem = function(btn) {
     currentPrice = btn.parentNode.querySelector(".product-price").textContent;
     currentDiscrition = btn.parentNode.querySelector(".product-description").textContent;
     currentCategory = btn.parentNode.querySelector(".product-category").textContent;
     currentImage = btn.parentNode.querySelector(".product-image").getAttribute("src");
    const btnParent = btn.parentNode;
    btnParent.innerHTML = "";
    const editModeHTML = `
    <div class="upload-image">
    <input type="file"  class="inputfile" accept="image/*"/>
    <ion-icon class="upload-icon" name="add-circle-outline"></ion-icon>
  </div>
  <input class="item-new-category edit-item-hover" type = "text" placeholder="Category:phone" maxlength="30">
  <textarea class="item-new-description edit-item-hover" placeholder="Discription" rows="3" cols="50"></textarea>
  <input class="item-new-price edit-item-hover"type = "text" placeholder="Price:xxx" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);">
  <div class="edit-mode ">
    <button class="save-changes prouct-buy ">Save</button>
    <ion-icon class="cancel-edit-btn" name="close-circle-outline"></ion-icon>
  </div>`;
    btnParent.insertAdjacentHTML("beforeend", editModeHTML);
    btnParent.querySelector(".item-new-category").value = currentCategory;
    btnParent.querySelector(".item-new-description").textContent = currentDiscrition.trim();
    btnParent.querySelector(".upload-image").style.backgroundImage = `url(${currentImage})`
    btnParent.querySelector(".item-new-price").value = currentPrice.replace(new RegExp(/\$/),"");
    const cancelBtn = btnParent.querySelector(".edit-mode").querySelector(".cancel-edit-btn");
    const saveBtn = btnParent.querySelector(".edit-mode").querySelector(".save-changes");
    // cancelBtn.addEventListener("click", ()=> cancelEdit(cancelBtn,currentPrice,currentDiscrition,currentCategory,currentImage));
    saveBtn.addEventListener("click",()=>saveEdit(saveBtn));
};

const cancelEdit = function(btn,oldPrice,oldDiscription,oldCategory,oldSrc){
    const btnParent = btn.parentNode.parentNode;
    btnParent.innerHTML = "";
    const cancelEdit = ` <img
    class="product-image"
    src="${oldSrc}"
  />
  <h1 class="product-category">${oldCategory}</h1>
  <p class="product-description">
    ${oldDiscription}
  </p>
  <h1 class="product-price">${oldPrice}</h1>
  <button class="market-btn product-buy">Edit!</button>`
  btnParent.innerHTML = cancelEdit;
  
}
const addNewItem = function(btn){
  const newDivItem = document.createElement("div");
  const newItemCategory =  btn.querySelector(".item-new-category").value;
  const newItemDescription = btn.querySelector(".item-new-description").value;
  const newItemPrice = btn.querySelector(".item-new-price").value;
  const newPhoto = window.getComputedStyle(btn.querySelector('.upload-image')).getPropertyValue('background-image').replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
  //TODO fetch the url from the background-image of the div
  //TODO const newItemImage????
  const newItem = `
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
    <button class="market-btn product-buy">Edit!</button>
  </div>`
  newDivItem.classList.add("inventory-item");
  if(newItemCategory !="" && newItemDescription!="" && newItemPrice != ""){ 
    newDivItem.innerHTML = newItem;
    inventoryDiv.insertBefore(newDivItem,btn.parentNode);
  }

}

const saveEdit = function(btn){
    const btnParent = btn.parentNode.parentNode;
    const newCategory = btnParent.querySelector(".item-new-category").value;
    const newDescription = btnParent.querySelector(".item-new-description").value;
    const newPrice = btnParent.querySelector(".item-new-price").value;
    const newPhoto = window.getComputedStyle(btnParent.querySelector('.upload-image')).getPropertyValue('background-image').replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
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
  <button class="market-btn product-buy">Edit!</button>`
  btnParent.innerHTML = editedHTML;
}


//TODO option to upload photos

const uploadImage = function(btn){
  const parentDiv = btn.parentNode;

  if(btn.files.length){
    const file = btn.files[0];
    parentDiv.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  }

}

//! Event handler

//? change modes
historyBtn.addEventListener("click",()=>{
    if(inventoryBtn.classList.contains("hidden") == false){
        historyBtn.classList.add("active-option");
        inventoryBtn.classList.remove("active-option");
        inventoryDiv.classList.add("hidden");
        historyDiv.classList.remove("hidden");
    }
})

inventoryBtn.addEventListener("click",()=>{
    if(historyBtn.classList.contains("hidden") == false){
        inventoryBtn.classList.add("active-option");
        historyBtn.classList.remove("active-option");
        historyDiv.classList.add("hidden");
        inventoryDiv.classList.remove("hidden");
    }
})
//? change modes
//? edit the item

document.addEventListener("focusin", (event) => {
    const target = event.target;
    //# Check if the clicked element is the edit button or within its descendant
    if (target.classList.contains("market-btn")) {
        editItem(target);
    }
    else if(target.classList.contains("inputfile")){
      target.addEventListener("change",()=>uploadImage(target) , false);
    }
});

document.addEventListener("focusout", (event) => {
  const target = event.relatedTarget; // Get the element that receives focus next
   // Check if target exists, if not, return
  const editModeDiv = document.querySelector(".edit-mode");
  if (editModeDiv && !editModeDiv.contains(target)) {
      const cancelBtn = editModeDiv.querySelector(".cancel-edit-btn");
      if (cancelBtn) {
          cancelEdit(cancelBtn,currentPrice,currentDiscrition,currentCategory,currentImage); // Exit edit mode
      }
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("cancel-edit-btn")) {
      target.parentNode.parentNode.remove(); // Delete the div
  }
});

addNewItemBtn.addEventListener("click", (event)=> {
  event.preventDefault();
  addNewItem(addNewItemBtn.parentNode)});
//# This code will handle click events for any element with the "market-btn" class,
//# including dynamically added elements, without needing to attach individual listeners to each one.
//? edit the item

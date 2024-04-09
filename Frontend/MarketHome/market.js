"use-strict";
//!Elements
const menuEl = document.querySelector(".menu-nav");
const productsGridEl = document.querySelector(".products-grid");
const navBarEl = document.querySelector(".nav-bar");
const productSectionEl = document.querySelector(".products-section");
//!API Generation
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    json.products.forEach((element) => {
      if (element.category === "smartphones") {
        const html = `
            <div class="product-grid-card">
            <img
              class="product-image"
              src="${element.images[0]}"
            />
            <h1 class="product-category">${element.title}</h1>
            <p class="product-description">
              ${element.description.slice(0, 55)}
            </p>
            <h1 class="product-price">${element.price}$</h1>
            <button class="market-btn product-buy">Buy!</button>
          </div>`;
        productsGridEl.insertAdjacentHTML("beforeend", html);
      }
    });
  });
//!Methods
const displayProfile = function (profileEl) {
  profileEl.addEventListener("click", function () {
    window.location.href = "";
  });
};
const closeModal = function (popupBuyWindowEl) {
  productSectionEl.removeChild(popupBuyWindowEl);
  productSectionEl.classList.remove("blurry");
};
//!Event handler
//* Add to cart listener

productSectionEl.addEventListener("click", function (e) {
  const clickedEl = e.target;
  //!Guard clause
  if (
    !clickedEl.classList.contains("product-buy") ||
    [...productSectionEl.children].some((child) =>
      child.classList.contains("buy-item-window")
    )
  ) {
    return;
  }

  //?1) Display a popup with the item full description, and containing a counter
  const cardEl = clickedEl.parentElement;
  const cardComponentsEl = [...cardEl.children];
  productSectionEl.classList.add("blurry");
  //<ion-icon name="close-outline"></ion-icon>
  const html = `
  <div class="buy-item-window">
  <div class="product-grid-card-buy">
  <div class="modal-close-div">
  <ion-icon class="close-modal" name="close-outline"></ion-icon>
  </div>    
    <img
        class="product-image"
        width="500"
        height="264"
        src="${cardComponentsEl[0].src}"
    />
    <h1 class="product-category">${cardComponentsEl[1].textContent}</h1>
    <p class="product-description">
      ${cardComponentsEl[2].textContent}
    </p>
    <h1 class="product-price">${cardComponentsEl[3].textContent}</h1>
    <div class="product-count-box">
      <button class="product-buy-counters product-buy-plus">+</button> 
      <h1 class="product-count">1</h1> 
      <button class="product-buy-counters product-buy-minus greyed-decrement">-</button>  
    </div>
    <button class="market-btn product-add">Add to cart!</button>
    </div>
  </div>`;
  productSectionEl.insertAdjacentHTML("beforeend", html);

  //*Close window button
  const closeBtnEl = document.querySelector(".close-modal");
  const popupBuyWindowEl = document.querySelector(".buy-item-window");
  closeBtnEl.addEventListener("click", function () {
    closeModal(popupBuyWindowEl);
  });

  //*Increment or decrement button
  const incrementCountEl = document.querySelector(".product-buy-plus");
  const decrementCountEl = document.querySelector(".product-buy-minus");
  const countEl = document.querySelector(".product-count");

  incrementCountEl.addEventListener("click", function () {
    //!Only increment if count becomes less than product count in DB
    countEl.textContent = +countEl.textContent + 1;
    decrementCountEl.classList.remove("greyed-decrement");
  });

  decrementCountEl.addEventListener("click", function () {
    if (countEl.textContent == 1) {
      return;
    }
    countEl.textContent = +countEl.textContent - 1;
    if (countEl.textContent == 1)
      decrementCountEl.classList.add("greyed-decrement");
  });

  //*Add to cart button
  const addToCartEl = document.querySelector(".product-add");
  addToCartEl.addEventListener("click", function () {
    //!Export the count of the items to the checkout page
    const cartBoxEl = document.querySelector(".cart-box");
    if (
      ![...cartBoxEl.children].some((child) =>
        child.classList.contains("shitty-container")
      )
    ) {
      const html = `
      <div class="shitty-container">
      <p class="checkout-counter">${countEl.textContent}<p>
      </div>
      `;
      cartBoxEl.insertAdjacentHTML("beforeend", html);
      console.log("You entered here :)");
    } else {
      const checkoutCounterEl = document.querySelector(".checkout-counter");
      checkoutCounterEl.textContent = +checkoutCounterEl.textContent + +countEl.textContent;
    }
    closeModal(popupBuyWindowEl);
  });
});

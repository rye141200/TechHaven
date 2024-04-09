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

//!Event handler
//* Add to cart listener

productSectionEl.addEventListener("click", function (e) {
  const clickedEl = e.target;
  //!Guard clause
  if (!clickedEl.classList.contains("product-buy")) return;

  //?1) Display a popup with the item full description, and containing a counter
  const cardEl = clickedEl.parentElement;
  const cardComponentsEl = [...cardEl.children];
  // document.querySelector(".market").classList.add('blurry');
  //<ion-icon name="close-outline"></ion-icon>
  const html = `
  <div class="buy-item-window">
    <div class="product-grid-card-buy">
    <ion-icon class="close-modal" name="close-outline"></ion-icon>
      <img
        class="product-image"
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
        <button class="product-buy-counters product-buy-minus">-</button>  
      </div>
      <button class="market-btn product-add">Add to cart!</button>
    </div>
  </div>`;
  productSectionEl.insertAdjacentHTML("beforeend", html);
});

"use-strict";
// import { os } from "./script.js";
// console.log(os);
const productsGridEl = document.querySelector(".products-grid");
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
              src="https://cdn.dummyjson.com/product-images/1/1.jpg"
            />
            <h1 class="product-category">Phone</h1>
            <p class="product-description">
              HP omen 15 Intel core i7- 16GB RAM = 512 GB SSD
            </p>
            <h1 class="product-price">3000$</h1>
            <button class="product-buy">Add to cart!</button>
          </div>`;
        productsGridEl.insertAdjacentHTML("beforeend", html);
      }
    });
  });

"use-strict";
//!Elements
const menuEl = document.querySelector(".menu-nav");
const productsGridEl = document.querySelector(".products-grid");
const navBarEl = document.querySelector(".nav-bar");
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
            <button class="product-buy">Add to cart!</button>
          </div>`;
        productsGridEl.insertAdjacentHTML("beforeend", html);
      }
    });
  });
//!Methods
const displayProfile = function(profileEl){
  profileEl.addEventListener('click',function(){
    window.location.href="";
  })
}


//!Event handler
menuEl.addEventListener("click", function () {
  const leftMenuEl = document.querySelector(".left-menu");
  leftMenuEl.classList.remove("hidden-menu");
  

  const leftMenuBtnEl = document.querySelector(".left-menu-btn");
  const homeEl = document.querySelector(".home");
  homeEl.classList.add("active-tab");

  //Toggle the menu button
  leftMenuBtnEl.addEventListener("click", function () {
    leftMenuEl.classList.add("hidden-menu");
  });

  //*Profile page listener
  const profileEl = document.querySelector(".profile");
  
  //*Wallet page listener
  //*Logout listener
});

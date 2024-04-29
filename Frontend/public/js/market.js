"use-strict";
//!Elements
const menuEl = document.querySelector(".menu-nav");
const productsGridEl = document.querySelector(".products-grid");
const navBarEl = document.querySelector(".nav-bar");
const productSectionEl = document.querySelector(".products-section");
const checkoutBoxEl = document.querySelector(".checkout-box");
const previousPageLink = document.querySelector("#prev");
const pageLink = document.querySelector(".page-link");
const nextPageLink = document.querySelector("#next");

//!API Generation
//! TO BE REPLACED WITH DATABASE/BACKEND FETCHING

//!Methods
const updateCount = (userCart) => {
  const itemCount = userCart.ArrayOfItems.reduce((acc, current) => {
    return +current.quantity + acc;
  }, 0);
  document.querySelector(".checkout-counter").textContent = itemCount;
};
const updateCartCount = () => {
  const cartBoxEl = document.querySelector(".cart-box");
  const userCart = JSON.parse(localStorage.getItem("userCart"));
  if (
    userCart.ArrayOfItems.length !== 0 &&
    ![...cartBoxEl.children].some((child) =>
      child.classList.contains("shitty-container")
    )
  ) {
    const html = `
    <div class="shitty-container">
    <p class="checkout-counter"><p>
    </div>
    `;
    cartBoxEl.insertAdjacentHTML("beforeend", html);
    updateCount(userCart);
  }
};

const updateCart = (boughtItem) => {
  const userCart = JSON.parse(localStorage.getItem("userCart"));
  userCart.ArrayOfItems.push(boughtItem);
  const mappedProducts = [];
  userCart.ArrayOfItems.forEach((product) => {
    if (
      !mappedProducts.some((mappedProduct) => mappedProduct.id == product.id)
    ) {
      mappedProducts.push(product);
    } else {
      const index = mappedProducts.findIndex(
        (mappedProduct) => mappedProduct.id == product.id
      );
      const sum = +mappedProducts[index].quantity + +product.quantity;
      mappedProducts[index].quantity =
        sum > +product.maxQuantity ? `${product.maxQuantity}` : `${sum}`;
    }
  });
  userCart.ArrayOfItems = mappedProducts;
  updateCount(userCart);
  localStorage.setItem("userCart", JSON.stringify(userCart));
};
const displayProfile = function (profileEl) {
  profileEl.addEventListener("click", function () {
    window.location.href = "";
  });
};
const closeModal = function (popupBuyWindowEl) {
  productSectionEl.removeChild(popupBuyWindowEl);
  productSectionEl.classList.remove("blurry");
};
const controlItemsCount = function (
  incrementBtnEl,
  decrementBtnEl,
  countTextEl,
  maxQuantity,
  productID
) {
  const incrementCountBtnEl = document.querySelector(incrementBtnEl);
  const decrementCountBtnEl = document.querySelector(decrementBtnEl);
  const countEl = document.querySelector(countTextEl);

  incrementCountBtnEl.addEventListener("click", function () {
    //!Only increment if count becomes less than product count in DB
    const incrementedValue = +countEl.textContent + 1;
    if (incrementedValue > maxQuantity) {
      incrementCountBtnEl.classList.add("greyed-decrement");
      return;
    }
    countEl.textContent = incrementedValue;
    decrementCountBtnEl.classList.remove("greyed-decrement");
  });

  decrementCountBtnEl.addEventListener("click", function () {
    if (countEl.textContent == 1) {
      return;
    }
    if (countEl.textContent == maxQuantity) {
      incrementCountBtnEl.classList.remove("greyed-decrement");
    }
    countEl.textContent = +countEl.textContent - 1;
    if (countEl.textContent == 1)
      decrementCountBtnEl.classList.add("greyed-decrement");
  });
};
const fetcher = (endpoint) => {
  return fetch(`${endpoint}`, {
    method: "GET",
    headers: {
      "Content-type": "text/html",
    },
  });
};
//!Event handlers
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
//* Buy event listener
productSectionEl.addEventListener("click", function (e) {
  const clickedEl = e.target;
  //!Guard clause
  if (
    !clickedEl.classList.contains("product-buy") ||
    [...productSectionEl.children].some(
      (child) =>
        child.classList.contains("buy-item-window") ||
        clickedEl.parentNode.querySelector(".ribbon")
    )
  ) {
    return;
  }

  //?1) Display a popup with the item full description, and containing a counter
  const cardEl = clickedEl.parentElement;
  const cardComponentsEl = [...cardEl.children];
  productSectionEl.classList.add("blurry");
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

  //?2)Close window button
  const closeBtnEl = document.querySelector(".close-modal");
  const popupBuyWindowEl = document.querySelector(".buy-item-window");
  closeBtnEl.addEventListener("click", function () {
    closeModal(popupBuyWindowEl);
  });

  //?3)Increment or decrement button
  const maxQuantity =
    +e.target.parentNode.querySelector("#quantity").textContent;
  const productID = e.target.parentNode.querySelector("#pid").textContent;
  const countEl = document.querySelector(".product-count");
  controlItemsCount(
    ".product-buy-plus",
    ".product-buy-minus",
    ".product-count",
    maxQuantity,
    productID
  );

  //?4)Add to cart button
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
    } else {
      const checkoutCounterEl = document.querySelector(".checkout-counter");
      checkoutCounterEl.textContent =
        +checkoutCounterEl.textContent + +countEl.textContent;
    }
    //!Export the item with the ID from the DB
    const boughtItemEl = [...addToCartEl.parentNode.children];
    const boughtItem = {
      quantity: countEl.textContent,
      src: boughtItemEl[1].src,
      category: boughtItemEl[2].textContent,
      description: boughtItemEl[3].textContent,
      price: Number.parseInt(boughtItemEl[4].textContent),
      id: productID,
      maxQuantity: maxQuantity,
      totalPrice:
        +countEl.textContent * +Number.parseInt(boughtItemEl[4].textContent),
    };
    updateCart(boughtItem);
    closeModal(popupBuyWindowEl);
  });
});

const cartBtnEl = document.querySelector("#cart");
cartBtnEl.addEventListener("click", async (e) => {
  //!Guard clause
  if (!document.querySelector(".checkout-counter")) return;
  try {
    const response = await fetcher(
      "/checkout",
      JSON.parse(localStorage.getItem("userCart")).ArrayOfItems
    );
    window.location.href = "/checkout";
  } catch (err) {
    alert("Couldn't reach the page");
  }
});

//******************** */
//*Pagination          */
//******************** */
const pageNumber = +pageLink.getAttribute("data-page");
previousPageLink.addEventListener("click", (e) => {
  if (pageNumber > 1) {
    fetch(`/market?page=${pageNumber - 1}`, {
      method: "GET",
      headers: { "Content-type": "text/html" },
    }).then(() => {
      window.location.assign(`/market?page=${pageNumber - 1}`);
    });
  }
});
nextPageLink.addEventListener("click", () => {
  const maxPageNum = +document
    .querySelector("#next")
    .getAttribute("maxnumpage");
  //!Guard clause
  if (pageNumber == maxPageNum) return;
  fetch(`/market?page=${pageNumber + 1}`, {
    method: "GET",
    headers: { "Content-type": "text/html" },
  }).then(() => {
    previousPageLink.classList.remove("inactive-pagination");
    window.location.assign(`/market?page=${pageNumber + 1}`);
  });
});

//******************** */
//*Search          */
//******************** */
const searchBtnEl = document.querySelector("#search-btn");
const searchBy = document.querySelector("#search-by");

searchBtnEl.addEventListener("click", async (e) => {
  const searchBarEl = document.querySelector(".search-bar");
  //!Guard clause
  if (searchBarEl.value == "") return;
  if (searchBy.value === "Name") {
    await fetch(`/search?name=${searchBarEl.value}`, {
      method: "GET",
      headers: { "Content-type": "text/html" },
    }).then(() => {
      window.location.href = `/search?name=${searchBarEl.value}`;
    });
  } else if (searchBy.value === "Price") {
    await fetch(`/search?price=${searchBarEl.value}`, {
      method: "GET",
      headers: { "Content-type": "text/html" },
    }).then(() => {
      window.location.href = `/search?price=${searchBarEl.value}`;
    });
  }
});

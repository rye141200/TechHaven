"use-strict";
//!Elements
const menuEl = document.querySelector(".menu-nav");
const productsGridEl = document.querySelector(".products-grid");
const navBarEl = document.querySelector(".nav-bar");
const productSectionEl = document.querySelector(".products-section");
const checkoutBoxEl = document.querySelector(".checkout-box");

//!API Generation
//! TO BE REPLACED WITH DATABASE/BACKEND FETCHING
fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    json.products.forEach((element) => {
      if (element.id <= 10) {
        const html = `
            <div class="product-grid-card">
            <img
              class="product-image"
              src="${element.images[0]}"
              />
            <h1 class="product-category">${element.title}</h1>
            <p class="product-description">
            <ion-icon name="document-text-outline"
            style="font-size:1.4rem;"></ion-icon>
              ${element.description.slice(0, 55)}
              </p>
              <h1 class="product-price">
              <ion-icon name="pricetag-outline"
              style="font-size:1.4rem;">
              </ion-icon>
              ${element.price}$
              </h1>
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
const controlItemsCount = function (
  incrementBtnEl,
  decrementBtnEl,
  countTextEl
) {
  const incrementCountBtnEl = document.querySelector(incrementBtnEl);
  const decrementCountBtnEl = document.querySelector(decrementBtnEl);
  const countEl = document.querySelector(countTextEl);

  incrementCountBtnEl.addEventListener("click", function () {
    //!Only increment if count becomes less than product count in DB
    countEl.textContent = +countEl.textContent + 1;
    decrementCountBtnEl.classList.remove("greyed-decrement");
  });

  decrementCountBtnEl.addEventListener("click", function () {
    if (countEl.textContent == 1) {
      return;
    }
    countEl.textContent = +countEl.textContent - 1;
    if (countEl.textContent == 1)
      decrementCountBtnEl.classList.add("greyed-decrement");
  });
};

//!Event handler
//* Buy event listener
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
  const countEl = document.querySelector(".product-count");
  controlItemsCount(
    ".product-buy-plus",
    ".product-buy-minus",
    ".product-count"
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
      console.log("You entered here :)");
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
      price: boughtItemEl[4].textContent,
    };

    const html = `
        <div class="purchased-item-at-checkout">
        <img
        src="${boughtItem.src}"
        width="200"
        height="200"
        />
        <div class="description">
        <h1 style="font-size: 1.2rem">${boughtItem.category}</h1>
        <h1 style="font-size: 1.2rem">${boughtItem.price}</h1>
        <h1 style="font-size:1.2rem">${boughtItem.description}</h1>
      </div>
      <div class="edit-buttons">
        <h1 class="count">${boughtItem.quantity}</h1>
        <button class="btn increment">+</button>
        <button class="btn decrement ${
          boughtItem.quantity == 1 ? "greyed-decrement" : ""
        }">-</button>
        <ion-icon class="delete-btn" name="trash-outline"></ion-icon>
        </div>
        </div>
        `;
    checkoutBoxEl.insertAdjacentHTML("afterbegin", html);
    closeModal(popupBuyWindowEl);
  });
});

//* Checkout handler
const cartBtnEl = document.querySelector("#cart");
const checkoutContainerEl = document.querySelector("#checkout");
const marketBoxEl = document.querySelector("#market");

cartBtnEl.addEventListener("click", function () {
  //!Guard clause
  if (!document.querySelector(".checkout-counter")) return;

  checkoutContainerEl.classList.remove("hidden");
  marketBoxEl.classList.add("hidden");

  //!Guard clause
  if (!document.querySelector(".checkout-btns-container")) {
    //?Complete and cancel checkout button
    const html = `
      <div class="checkout-btns-container">
        <button class="market-btn complete-checkout-btn">
          Complete checkout
        </button>
        <button class="market-btn cancel-checkout-btn">
          Cancel
        </button>
      </div>
      `;
    checkoutBoxEl.insertAdjacentHTML("beforeend", html);
  }
  //!Don't forget to add complete checkout event listener using AWS
  //TODO
  //?Cancel checkout listener
  const cancelCheckoutBtnEl = document.querySelector(".cancel-checkout-btn");
  cancelCheckoutBtnEl.addEventListener("click", function () {
    //Display market UI once again
    const boughtItemsCountEl = document.querySelectorAll(".count");
    if (boughtItemsCountEl) {
      const counts = document.querySelector(".checkout-counter");
      counts.textContent = +[...boughtItemsCountEl]
        .map((item) => +item.textContent)
        .reduce((acc, mov) => acc + mov, 0);
    }
    checkoutContainerEl.classList.add("hidden");
    marketBoxEl.classList.remove("hidden");
  });
});

//?Delete, increment and decrement items at checkout
checkoutBoxEl.addEventListener("click", function (e) {
  const countEl = [...e.target.parentNode.children].map((child) => {
    if (child.classList.contains("count")) return child;
  })[0];
  //!Guard clauses
  if (e.target.classList.contains("delete-btn")) {
    const parentOne = e.target.parentNode.parentNode;
    checkoutBoxEl.removeChild(parentOne);
    if (![...checkoutBoxEl.children].some(child=>child.classList.contains("purchased-item-at-checkout"))) {
      // nothing inside cart
      checkoutContainerEl.classList.add("hidden");
      marketBoxEl.classList.remove("hidden");
      document.querySelector(".cart-box").removeChild(document.querySelector(".shitty-container"));
    }
  } else if (e.target.classList.contains("increment")) {
    //!Only increment if count becomes less than product count in DB
    countEl.textContent = +countEl.textContent + 1;
    [...e.target.parentNode.children].forEach((child) => {
      if (child.classList.contains("decrement"))
        child.classList.remove("greyed-decrement");
    });
  } else if (e.target.classList.contains("decrement")) {
    if (countEl.textContent == 1) {
      return;
    }
    countEl.textContent = +countEl.textContent - 1;
    if (countEl.textContent == 1) e.target.classList.add("greyed-decrement");
  } else return;
});

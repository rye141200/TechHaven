"use strict";
//********************** */
//* Checkout section     */
//********************** */
const cartBtnEl = document.querySelector("#cart");
const checkoutContainerEl = document.querySelector("#checkout");
const marketBoxEl = document.querySelector("#market");
const checkoutBoxEl = document.querySelector(".checkout-box");
const stripe = Stripe(
  "pk_test_51P9r40K6AkPzXON8RSA9BFP7egHFCzk4kiAavJyRZNm2aMoMYJDD4FPrKMaMOcuFI6UkjSXlw5v07N7Y8ckmfiD200qzHXwNxh"
);
//!Methods
fetch("/checkout", {
  method: "GET",
  headers: { "Content-type": "text/html" },
});
const fetcher = (endpoint, productsData) => {
  return fetch(`${endpoint}`, {
    method: "PATCH",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ productsData }),
  })
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => {
      alert("Couldn't proccess payment");
    });
};
document.addEventListener("DOMContentLoaded", (e) => {
  //!1) Get the items from cart
  const userCart = JSON.parse(localStorage.getItem("userCart"));
  userCart.ArrayOfItems.forEach((boughtItem) => {
    const html = `
    <div class="purchased-item-at-checkout">
  <img src="${
    boughtItem.src
  }" width="200" height="200" style="width:200px!important;height:200px!important;" />
  <div class="description">
    <h1 style="font-size: 1.2rem">${boughtItem.category}</h1>
    <h1 style="font-size: 1.2rem">${boughtItem.description}</h1>
    <h1
      id="item-price"
      style="font-size: 1.2rem; color: var(--primaryColorLight)"
    >
      ${boughtItem.totalPrice}$
    </h1>
  </div>
  <div class="edit-buttons">
    <h1 class="count">${boughtItem.quantity}</h1>
    <button class="btn increment">+</button>
    <button
      class="btn decrement ${
        boughtItem.quantity == 1 ? "greyed-decrement" : ""
      }"
    >
      -
    </button>
    <ion-icon class="delete-btn" name="trash-outline"></ion-icon>
  </div>
  <h1 class="pidAtCheckout hidden">${boughtItem.id}</h1>
  <h1 class="quantityAtCheckout hidden">${boughtItem.maxQuantity}</h1>
</div>
    `;
    checkoutBoxEl.insertAdjacentHTML("afterbegin", html);
  });
});
const deleteItemAtCheckout = (e, userCart) => {
  const parentOne = e.target.parentNode.parentNode;
  //*Remove the elements
  const id = parentOne.querySelector(".pidAtCheckout").textContent;
  const index = userCart.ArrayOfItems.findIndex((item) => item.id == id);
  userCart.ArrayOfItems.splice(index, 1); //remove the element
  localStorage.setItem("userCart", JSON.stringify(userCart));
  checkoutBoxEl.removeChild(parentOne);
};
const updateItemAtCheckout = (e, userCart, incrementedValue, totalPrice) => {
  const id =
    e.target.parentNode.parentNode.querySelector(".pidAtCheckout").textContent;
  const index = userCart.ArrayOfItems.findIndex((product) => product.id == id);
  userCart.ArrayOfItems[index].quantity = `${incrementedValue}`;
  userCart.ArrayOfItems[index].totalPrice = Number.parseInt(
    totalPrice.textContent
  );
  localStorage.setItem("userCart", JSON.stringify(userCart));
};
const checkoutHandler = async (endpoint, type) => {
  const response = await fetch(`${endpoint}`, {
    method: `${type}`,
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(
      JSON.parse(localStorage.getItem("userCart")).ArrayOfItems
    ),
  })
    .then((response) => response.json())
    .then((response) => response);
  if (response.status == "success") {
    //remove everything from cart
    const userCart = JSON.parse(localStorage.getItem("userCart"));
    userCart.ArrayOfItems = [];
    localStorage.setItem("userCart", JSON.stringify(userCart));
    //!Add animation later
    return window.setTimeout(() => {
      location.assign("/market");
    }, 0);
  }
};

//!Don't forget to add complete checkout event listener
//TODO
//*Complete checkout handler
const completeCheckoutBtn = document.querySelector(".complete-checkout-btn");

completeCheckoutBtn.addEventListener("click", async (e) => {
  const creditCardRadioBtn = document.querySelector("#credit-card");
  const walletRadioBtn = document.querySelector("#wallet");
  //!Guard clause
  if (!walletRadioBtn.checked && !creditCardRadioBtn.checked) return;
  const purchasedItems = document.querySelectorAll(
    ".purchased-item-at-checkout"
  );

  if (walletRadioBtn.checked) {
    checkoutHandler("/checkout", "PATCH");
  } else {
    try {
      const session = await fetch("/checkout/checkout-session", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(
          JSON.parse(localStorage.getItem("userCart")).ArrayOfItems
        ),
      }).then((response) => response.json());
      await stripe.redirectToCheckout({
        sessionId: session.session.id,
      });
    } catch (err) {}
  }
});

//?Cancel checkout listener
const cancelCheckoutBtnEl = document.querySelector(".cancel-checkout-btn");
cancelCheckoutBtnEl.addEventListener("click", function () {
  //Display market UI once again
  window.location.href = "/market";
});

//?Delete, increment and decrement items at checkout
checkoutBoxEl.addEventListener("click", function (e) {
  const userCart = JSON.parse(localStorage.getItem("userCart"));
  const countEl = [...e.target.parentNode.children].map((child) => {
    if (child.classList.contains("count")) return child;
  })[0];
  //!Guard clauses
  if (e.target.classList.contains("delete-btn")) {
    deleteItemAtCheckout(e, userCart);
    if (
      ![...checkoutBoxEl.children].some((child) =>
        child.classList.contains("purchased-item-at-checkout")
      )
    ) {
      //!nothing inside cart
      window.location.href = "/market";
      /* document
        .querySelector(".cart-box")
        .removeChild(document.querySelector(".shitty-container")); */
    }
  } else if (e.target.classList.contains("increment")) {
    //!Only increment if count becomes less than product count in DB
    const maxQuantity = +e.target.parentNode.parentNode.querySelector(
      ".quantityAtCheckout"
    ).textContent;
    //!Update total price
    const incrementedValue = +countEl.textContent + 1;
    if (incrementedValue > maxQuantity) {
      return e.target.classList.add("greyed-decrement");
    }
    const totalPrice =
      e.target.parentNode.parentNode.querySelector("#item-price");
    const singlePrice =
      Number.parseInt(totalPrice.textContent) /
      Number.parseInt(countEl.textContent);
    countEl.textContent = `${incrementedValue}`;
    totalPrice.textContent = `${
      singlePrice * Number.parseInt(countEl.textContent)
    }
    $`;
    //Update local storage
    updateItemAtCheckout(e, userCart, incrementedValue, totalPrice);
    [...e.target.parentNode.children].forEach((child) => {
      if (child.classList.contains("decrement"))
        child.classList.remove("greyed-decrement");
    });
  } else if (e.target.classList.contains("decrement")) {
    if (countEl.textContent == 1) {
      return;
    }
    const maxQuantity = +e.target.parentNode.parentNode.querySelector(
      ".quantityAtCheckout"
    ).textContent;
    if (maxQuantity == countEl.textContent) {
      e.target.parentNode
        .querySelector(".increment")
        .classList.remove("greyed-decrement");
    }
    //!Update total price
    const decrementedValue = +countEl.textContent - 1;
    const totalPrice =
      e.target.parentNode.parentNode.querySelector("#item-price");
    const singlePrice =
      Number.parseInt(totalPrice.textContent) /
      Number.parseInt(countEl.textContent);
    countEl.textContent = +countEl.textContent - 1;
    totalPrice.textContent = `${
      singlePrice * Number.parseInt(countEl.textContent)
    }
    $`;
    updateItemAtCheckout(e, userCart, decrementedValue, totalPrice);
    if (countEl.textContent == 1) e.target.classList.add("greyed-decrement");
  } else return;
});

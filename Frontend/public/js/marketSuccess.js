"use strict";
const onLoadPaymentHandler = async () => {
  const response = await fetch("/checkout/checkout-session/update", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(
      JSON.parse(localStorage.getItem("userCart")).ArrayOfItems
    ),
  }).then((response) => response.json());
  if (response.status == "success") {
    //remove everything from cart
    const userCart = JSON.parse(localStorage.getItem("userCart"));
    userCart.ArrayOfItems = [];
    localStorage.setItem("userCart", JSON.stringify(userCart));
  } else {
    alert("Couldn't make payment");
  }
};
setTimeout(async () => {
  await onLoadPaymentHandler();
  window.location.href = "/market";
}, 3000);

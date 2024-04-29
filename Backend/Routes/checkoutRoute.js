const express = require("express");
const checkoutHandler = require(`${__dirname}/../Controllers/checkoutHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);
//?Import controller here

const checkoutRouter = express.Router();

checkoutRouter
  .route("/")
  .patch(
    authHandler.isAuthenticated,
    checkoutHandler.checkBalance,
    checkoutHandler.decrementItems,
    checkoutHandler.storeOrder
  )
  .get(authHandler.isAuthenticated, checkoutHandler.renderCheckoutUI);

checkoutRouter
  .route("/checkout-session")
  .post(authHandler.isAuthenticated, checkoutHandler.stripeCheckout);

checkoutRouter
  .route("/checkout-session/update")
  .post(
    authHandler.isAuthenticated,
    checkoutHandler.decrementItems,
    checkoutHandler.storeOrder
  );
module.exports = checkoutRouter;

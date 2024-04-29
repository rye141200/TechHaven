const express = require("express");
const depositHandler = require(`${__dirname}/../Controllers/depositHandler`);
const authHandler = require("./../Controllers/authHandler");
//?Import controller here

const depositRouter = express.Router();

depositRouter
  .route("/")
  .get(authHandler.isAuthenticated, depositHandler.renderDepositUI)
  .patch(
    authHandler.isAuthenticated,
    depositHandler.makeDeposit,
    depositHandler.storeDeposit
  );

module.exports = depositRouter;

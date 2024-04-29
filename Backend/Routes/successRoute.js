const express = require("express");
const successHandler = require(`./../Controllers/successHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);

//?Import controller here

const successRouter = express.Router();

successRouter
  .route("/")
  .get(authHandler.isAuthenticated, successHandler.renderSuccessUI);

module.exports = successRouter;

const express = require("express");
const marketHandler = require(`${__dirname}/../Controllers/marketHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);

//?Import controller here

const marketRouter = express.Router();

marketRouter
  .route("/")
  .get(authHandler.isAuthenticated, marketHandler.renderMarketUI);

module.exports = marketRouter;

const express = require("express");
const profileHandler = require(`${__dirname}/../Controllers/profileHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);

const profileRouter = express.Router();

profileRouter
  .route("/")
  .get(authHandler.isAuthenticated, profileHandler.renderProfileUI);

module.exports = profileRouter;

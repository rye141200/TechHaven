const express = require("express");
const logoutHandler = require(`${__dirname}/../Controllers/logoutHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);

const logoutRouter = express.Router();

logoutRouter.route("/").get(authHandler.isAuthenticated, logoutHandler.logout);

module.exports = logoutRouter;

const express = require("express");
const adminHandler = require(`${__dirname}/../Controllers/adminHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);

//?Import controller here

const adminRouter = express.Router();

adminRouter
  .route("/")
  .get(adminHandler.renderAdminLoginUI)
  .post(adminHandler.login);

module.exports = adminRouter;

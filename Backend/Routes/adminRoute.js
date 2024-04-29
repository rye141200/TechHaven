const express = require("express");
const adminHandler = require(`${__dirname}/../Controllers/adminHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);

//?Import controller here

const adminRouter = express.Router();

adminRouter
  .route("/login")
  .get(adminHandler.renderAdminLoginUI)
  .post(adminHandler.login);

adminRouter.route("/dashboard").get(adminHandler.renderAdminDashboardUI);

module.exports = adminRouter;

const express = require("express");
const dashboardHandler = require(`${__dirname}/../Controllers/dashboardHandler`);
const authHandler = require(`${__dirname}/../Controllers/authHandler`);

//?Import controller here

const dashboardRouter = express.Router();

dashboardRouter
  .route("/")
  .get(authHandler.isAuthenticated, dashboardHandler.renderDashboardUI);

module.exports = dashboardRouter;

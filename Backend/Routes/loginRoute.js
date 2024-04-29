const express = require("express");
const loginHandler = require(`${__dirname}/../Controllers/loginHandler`);
//?Import controller here

const loginRouter = express.Router();

loginRouter.route("/").post(loginHandler.login);

module.exports = loginRouter;

const express = require("express");
const signupHandler = require(`${__dirname}/../Controllers/signupHandler`);
//?Import controller here

const signupRouter = express.Router();

signupRouter.route("/").post(signupHandler.checkEmails, signupHandler.signup);

module.exports = signupRouter;

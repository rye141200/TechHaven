const express = require("express");
const searchHandler = require(`${__dirname}/../Controllers/searchHandler`);
//?Import controller here

const searchRouter = express.Router();

searchRouter.route("/").get(searchHandler.search);

module.exports = searchRouter;

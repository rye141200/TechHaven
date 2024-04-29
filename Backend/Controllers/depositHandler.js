const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });
exports.renderDepositUI = async (req, res) => {
  try {
    const loggedInUser = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );
    const databaseHandler = require("./databaseHandler");
    const connection = require("./../server");
    const user = JSON.parse(
      JSON.stringify(
        await databaseHandler.getUser(req, res, connection, loggedInUser.ID)
      )
    )[0];
    res.status(200).render("deposit.ejs", { user });
  } catch (err) {
    return res.redirect("/");
  }
};
exports.makeDeposit = async (req, res, next) => {
  try {
    const connection = require(`./../server`);
    const databaseHandler = require("./databaseHandler");
    const loggedInUser = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );
    await databaseHandler.makeDeposit(
      req,
      res,
      connection,
      loggedInUser,
      req.body.newValue
    );
    next();
  } catch (err) {
    return res.status(400).redirect("/");
  }
};
exports.storeDeposit = async (req, res) => {
  try {
    const connection = require("./../server");
    const databaseHandler = require("./databaseHandler");
    const loggedInUser = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );
    //!1) Getting the depositID
    const depositID = Object.values(
      JSON.parse(
        JSON.stringify(await databaseHandler.generateUUID(req, res, connection))
      )[0]
    )[0];
    //!2) Storing the deposit
    await databaseHandler.storeInDepositTable(
      req,
      res,
      connection,
      loggedInUser.ID,
      req.body.depositAmount,
      depositID
    );
    return res.status(200).json({
      status: "success",
      message: "Deposit made successfully ✅",
    });
  } catch (err) {
    return res.status(404).redirect("/");
  }
};

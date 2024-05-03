const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });

//! replace with acutal database!!
// const dataBase = JSON.parse(
//   fs.readFileSync(`${__dirname}/../database.json`, "utf-8")
// );
exports.getAllSellingItems = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "later",
  });
};
exports.CreateNewSellingItem = async (req, res) => {
  const loggedInUser = jwt.verify(
    req.cookies.token,
    process.env.JWT_SECRET_KEY
  );
  const connection = require("./../server");
  const databaseHandler = require("./databaseHandler");
  const tempPath =
    "uploads/" +
    req.file.path
      .replace(/\\/g, "/")
      .replace(/^.*public[\\\/]uploads[\\\/]/, "");
  const newItem = {
    Name: req.body.newItemCategory,
    Description: req.body.newItemDescription,
    Price: req.body.newItemPrice,
    Image: tempPath,
    Available_Quantity: req.body.newItemQuantity,
    Seller_ID: loggedInUser.ID,
  };
  try {
    const uuid = Object.values(
      JSON.parse(
        JSON.stringify(await databaseHandler.generateUUID(req, res, connection))
      )[0]
    )[0];
    await databaseHandler.createNewProduct(
      req,
      res,
      connection,
      loggedInUser.ID,
      newItem,
      uuid
    );
    res.status(201).json({
      status: "Ok",
      body: { uuid },
    });
  } catch (err) {
    res.status(422).json({
      status: "failure",
      message: "Couldn't create 🧑🏿‍🦲",
    });
  }
};
exports.updateCurrentSellingItem = async (req, res) => {
  try {
    const loggedInUser = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );
    const connection = require("./../server");
    const databaseHandler = require("./databaseHandler");
    let tempPath;
    if (req.file) {
      tempPath =
        "uploads/" +
        req.file.path
          .replace(/\\/g, "/")
          .replace(/^.*public[\\\/]uploads[\\\/]/, "");
    }
    const newItem = {
      Name: req.body.newItemCategory,
      Description: req.body.newItemDescription,
      Price: req.body.newItemPrice,
      Image: tempPath || "",
      Available_Quantity: req.body.newItemQuantity,
      Seller_ID: loggedInUser.ID,
    };
    databaseHandler.updateDB(req, res, connection, newItem, req.body.ID);
    return res.status(200).json({
      status: "success",
      message: "ok",
    });
  } catch (e) {
    return res.status(400).json({
      status: "Failure",
      message: "Couldn't update selling items",
    });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  const connection = require("./../server");
  const databaseHandler = require("./databaseHandler");

  try {
    //*Approach 1:
    //!1) Check if product exists in a previous order
    //!2) If product doesn't exist, then delete safely
    //!3) If it exists, delete from order_products, then delete from product
    const isBoughtProducts = JSON.parse(
      JSON.stringify(
        await databaseHandler.checkIfBoughtProduct(
          req,
          res,
          connection,
          req.body.id
        )
      )
    );
    if (isBoughtProducts.length == 0) {
      await databaseHandler.deleteFromDB(req, res, connection, req.body.id);
      return res.status(204).json({
        status: "sucess",
        message: "deleted successfully from database",
      });
    }
    //!delete from order_products
    await databaseHandler.deleteFromOrderProduct(
      req,
      res,
      connection,
      req.body.id
    );
    //!delete from product table
    await databaseHandler.deleteFromDB(req, res, connection, req.body.id);
    return res.status(204).json({
      status: "sucess",
      message: "deleted successfully from database",
    });
  } catch (e) {
    res.status(410).json({
      status: "failed",
      message: "couldn't delete from database",
    });
  }
};

//*Approach 2:
//!1) Check if product exists in a previous order
//!2) If product doesn't exist, then delete safely
//!3) If it exists, update the new field (available for market) to be false, then in market, add a ribbon indicating that this product is no longer available (used to be in the market but now deleted)

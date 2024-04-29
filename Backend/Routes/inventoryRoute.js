const express = require("express");
const multer = require("multer");
const path = require("path");
const authHandler = require("./../Controllers/authHandler");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(`${__dirname}`, "../../Frontend/public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const {
  getAllSellingItems,
  CreateNewSellingItem,
  updateCurrentSellingItem,
  deleteInventoryItem,
} = require(`${__dirname}/../Controllers/inventoryHandler`);

router
  .route("/")
  .get(authHandler.isAuthenticated, getAllSellingItems)
  .post(
    authHandler.isAuthenticated,
    upload.single("image"),
    CreateNewSellingItem
  )
  .patch(
    authHandler.isAuthenticated,
    upload.single("image"),
    updateCurrentSellingItem
  )
  .delete(authHandler.isAuthenticated, deleteInventoryItem);

module.exports = router;

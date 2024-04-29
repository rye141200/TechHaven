const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });
exports.renderProfileUI = async (req, res) => {
  const databaseHandler = require("./databaseHandler");
  const connection = require("./../server");
  try {
    const loggedInUser = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );
    const user = JSON.parse(
      JSON.stringify(
        await databaseHandler.getUser(req, res, connection, loggedInUser.ID)
      )
    )[0];
    //!History
    //?1) Get ALL orders made by the logged in user
    const orders = Object.values(
      JSON.parse(
        JSON.stringify(
          await databaseHandler.getAllProductsBoughtByUser(
            req,
            res,
            connection,
            loggedInUser.ID
          )
        )
      )
    );
    //?2) Get ALL products in these orders
    const productsInOrders = [];
    for (const order of orders) {
      productsInOrders.push(
        Object.values(
          JSON.parse(
            JSON.stringify(
              await databaseHandler.getProductsInOrder(
                req,
                res,
                connection,
                order.ID
              )
            )
          )
        )
      );
    }
    const historyProducts = productsInOrders;

    historyProducts.forEach((product) => {
      product.forEach((item) => {
        const dateObj = new Date(item.Date);
        const year = dateObj.getFullYear().toString().slice(-2);
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        const day = ("0" + dateObj.getDate()).slice(-2);
        const hours = ("0" + dateObj.getHours()).slice(-2);
        const minutes = ("0" + dateObj.getMinutes()).slice(-2);
        const seconds = ("0" + dateObj.getSeconds()).slice(-2);
        item.Date = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
      });
    });
    //!RENDERING
    const products = JSON.parse(
      JSON.stringify(
        await databaseHandler.getProducts(req, res, connection, loggedInUser.ID)
      )
    );

    res.status(200).render("profile.ejs", { products, user, historyProducts });
  } catch (err) {
    res.redirect("/");
  }
};

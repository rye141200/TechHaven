const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });

exports.search = async (req, res) => {
  const connection = require("./../server");
  const databaseHandler = require("./databaseHandler");
  const queryObj = { ...req.query }; // localhost:3000/market?page=1
  const { name, price } = queryObj;
  const { page } = queryObj;
  pageNumber = page * 1 || 1;
  const limit = 12;
  const offset = (pageNumber - 1) * limit;
  const loggedInUser = jwt.verify(
    req.cookies.token,
    process.env.JWT_SECRET_KEY
  );
  let products;
  let maxNumberOfProducts;
  try {
    if (name) {
      products = Object.values(
        JSON.parse(
          JSON.stringify(
            await databaseHandler.searchByName(
              req,
              res,
              connection,
              name,
              limit,
              offset
            )
          )
        )
      );
      if (products.length == 0) {
        return res.status(200);
      }
      maxNumberOfProducts = Object.values(
        JSON.parse(
          JSON.stringify(
            await databaseHandler.searchByNameCount(req, res, connection, name)
          )
        )[0]
      )[0];
    }
    if (price) {
      products = Object.values(
        JSON.parse(
          JSON.stringify(
            await databaseHandler.searchByPrice(
              req,
              res,
              connection,
              price,
              limit,
              offset
            )
          )
        )
      );
      if (products.length == 0) {
        return res.status(200);
      }
      maxNumberOfProducts = Object.values(
        JSON.parse(
          JSON.stringify(
            await databaseHandler.searchByPriceCount(
              req,
              res,
              connection,
              price
            )
          )
        )[0]
      )[0];
    }
    if (!products) {
      return res.status(404);
    }
    const user = JSON.parse(
      JSON.stringify(
        await databaseHandler.getUser(req, res, connection, loggedInUser.ID)
      )
    )[0];
    const maxNumPages =
      maxNumberOfProducts % limit == 0
        ? Number.parseInt(maxNumberOfProducts / limit)
        : Number.parseInt(maxNumberOfProducts / limit) + 1;

    res
      .status(200)
      .render("market.ejs", { products, user, pageNumber, maxNumPages });
  } catch (err) {
    res.status(404).redirect("/market");
  }
};

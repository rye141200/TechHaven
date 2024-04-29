require("dotenv").config({ path: "config.env" });
const queryPro = (req, res, connection, sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err)
        return res.status(404).json({
          status: "Failure",
          message: "Couldn't get products 🧑🏿‍🦲",
        });
      resolve(result);
    });
  });
};
const renderProducts = async (req, res, connection, limit, offset) => {
  const sql = `SELECT * FROM sakila.product LIMIT ${limit} OFFSET ${offset}`;
  return await queryPro(req, res, connection, sql);
};
exports.renderMarketUI = async (req, res) => {
  const jwt = require("jsonwebtoken");
  const token = req.cookies.token;
  const loggedInUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
  try {
    const connection = require(`./../server`);
    const databaseHandler = require("./databaseHandler");
    const queryObj = { ...req.query }; // localhost:3000/market?page=1
    const pageNumber = req.query.page * 1 || 1;
    const limit = 12;
    const offset = (pageNumber - 1) * limit;

    //!refactor this later ^_^
    const products = JSON.parse(
      JSON.stringify(await renderProducts(req, res, connection, limit, offset))
    );
    const maxNumberOfProducts = Object.values(
      JSON.parse(
        JSON.stringify(
          await databaseHandler.getAllProductsCount(req, res, connection)
        )
      )[0]
    )[0];
    // products
    const maxNumPages =
      maxNumberOfProducts % limit == 0
        ? Number.parseInt(maxNumberOfProducts / limit)
        : Number.parseInt(maxNumberOfProducts / limit) + 1;

    const user = JSON.parse(
      JSON.stringify(
        await databaseHandler.getUser(req, res, connection, loggedInUser.ID)
      )
    )[0];
    res
      .status(200)
      .render("market.ejs", { products, user, pageNumber, maxNumPages });
  } catch (err) {
    return res.status(401).json({
      status: "Failure",
      message: "Unauthorized!",
    });
  }
};

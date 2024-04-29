const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });
const databaseHandler = require("./databaseHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const getTotalPrice = (req, res) => {
  return req.body.reduce((acc, current) => {
    return acc + current.totalPrice;
  }, 0);
};
exports.renderCheckoutUI = (req, res) => {
  res.render("checkout.ejs");
};
exports.checkBalance = async (req, res, next) => {
  const loggedInUser = jwt.verify(
    req.cookies.token,
    process.env.JWT_SECRET_KEY
  );
  const connection = require("./../server");
  try {
    const { Balance } = JSON.parse(
      JSON.stringify(
        await databaseHandler.getUserBalance(
          req,
          res,
          connection,
          loggedInUser.ID
        )
      )
    )[0];
    const totalPrice = getTotalPrice(req, res);

    if (totalPrice > Balance) {
      return res.status(400).json({
        status: "failure",
        message: "User doesn't have enough balance 🧑🏿‍🦲",
      });
    }

    const newBalance = Balance - totalPrice;
    await databaseHandler.decrementBalance(
      req,
      res,
      connection,
      loggedInUser.ID,
      newBalance
    );
  } catch (err) {
    return res.status(400).json({
      status: "failure",
      message: "Couldn't decrement balance 🧑🏿‍🦲",
    });
  }
  next();
};
exports.decrementItems = async (req, res, next) => {
  const connection = require("./../server");
  try {
    for (const boughtItem of req.body) {
      const remainingQuantity =
        boughtItem.maxQuantity - Number.parseInt(boughtItem.quantity);
      await databaseHandler.decrementItemsCount(
        req,
        res,
        connection,
        boughtItem.id,
        remainingQuantity
      );
    }
    next();
  } catch (err) {
    return res.status(400).json({
      status: "failure",
      message: "Couldn't decrement item count at the database 🧑🏿‍🦲",
    });
  }
};
exports.storeOrder = async (req, res) => {
  const connection = require("./../server");
  try {
    const loggedInUser = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET_KEY
    );
    //!1) Getting UUIDs
    const orderID = Object.values(
      JSON.parse(
        JSON.stringify(await databaseHandler.generateUUID(req, res, connection))
      )[0]
    )[0];
    //!2) Storing the order inside order table
    await databaseHandler.storeOrderInOrdersTable(
      req,
      res,
      connection,
      loggedInUser.ID,
      getTotalPrice(req, res),
      "Wallet",
      orderID
    );
    //!3) Storing into orders
    for (const product of req.body) {
      await databaseHandler.storeInOrderProductsTable(
        req,
        res,
        connection,
        orderID,
        product.id,
        product.quantity
      );
    }
    //!4)Return the response
    return res.status(200).json({
      status: "success",
      message: "Order made successfully ✅😎",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: "Couldn't store order 🧑🏿‍🦲",
    });
  }
};

//!STRIPE CHECKOUTS

exports.stripeCheckout = async (req, res, next) => {
  //!1)Getting items to be bought
  const boughtItems = req.body.map((product) => {
    return {
      price_data: {
        currency: "usd",
        unit_amount: product.price * 100,
        product_data: {
          name: product.category,
          description: product.description,
          images: [product.src],
        },
      },
      quantity: product.quantity,
    };
  });
  const loggedInUser = jwt.verify(
    req.cookies.token,
    process.env.JWT_SECRET_KEY
  );
  //!2) Creating stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/success`,
    cancel_url: `${req.protocol}://${req.get("host")}/market`,
    customer_email: loggedInUser.Email,
    line_items: boughtItems,
    mode: "payment",
  });

  //!3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  const endpointSecret = process.env.WEBHOOK_SECRET_KEY;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    // res.redirect("/checkout/checkout-session/update");
  }
  res.status(200).json({ received: true });
};

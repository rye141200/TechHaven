const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const loginRouter = require("./Routes/loginRoute");
const signupRouter = require("./Routes/signupRoute");
const marketRouter = require("./Routes/marketRoute");
const logoutRouter = require("./Routes/logoutRoute");
const profileRouter = require("./Routes/profileRoute");
const depositRouter = require("./Routes/depositRoute");
const inventoryRouter = require("./Routes/inventoryRoute");
const checkoutRouter = require("./Routes/checkoutRoute");
const checkoutHandler = require("./Controllers/checkoutHandler");
const successRouter = require("./Routes/successRoute");
const searchRouter = require("./Routes/searchRoute");
const adminRouter = require("./Routes/adminRoute");
const dashboardRouter = require("./Routes/dashboardRoute");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });
const app = express();
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.options("*", cors());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", `${__dirname}/../Frontend/public/`);
//!Middlewares
app.use(express.static(`${__dirname}/../Frontend/public/`));

app.use(morgan("dev"));
app.post(
  "/webhook-checkout",
  bodyParser.raw({ type: "application/json" }),
  checkoutHandler.webhookCheckout
);
app.use(express.json());

//?Routes
//*Renders
app.get("/", (req, res) => {
  try {
    if (jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY)) {
      res.status(200).redirect("/market");
    } else {
      res.status(200).render("login.ejs");
    }
  } catch (err) {
    res.status(200).render("login.ejs");
  }
});
app.use("/signup", signupRouter);
app.use("/", loginRouter);
app.use("/market", marketRouter);
app.use("/search", searchRouter);
app.use("/success", successRouter);
app.use("/profile", profileRouter);
app.use("/inventory", inventoryRouter);
app.use("/deposit", depositRouter);
app.use("/checkout", checkoutRouter);
app.use("/logout", logoutRouter);
app.use("/admin", adminRouter);
app.use("/dashboard", dashboardRouter);
module.exports = app;

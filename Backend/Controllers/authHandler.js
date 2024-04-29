const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });
exports.isAuthenticated = (req, res, next) => {
  try {
    user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    if (user) {
      return next(); //verified
    }
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/");
  }
};

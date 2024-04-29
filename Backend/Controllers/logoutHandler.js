const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });
exports.logout = (req, res) => {
  //TODO: Logout logic
  try {
    const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    if (user) {
      res.clearCookie("token");
      return res.redirect("/");
    }
  } catch (err) {
    return res.redirect("/");
  }
};

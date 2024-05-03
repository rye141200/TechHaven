const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "config.env" });
exports.login = async (req, res) => {
  const connection = require(`./../server`);
  const databaseHandler = require("./databaseHandler");
  try {
    const loginResult = await databaseHandler.login(req, res, connection);
    if (loginResult.length != 1)
      return res.status(404).json({
        status: "Failure",
        message: "User not found 🧑🏿‍🦲",
      });
    const jwtUser = JSON.parse(JSON.stringify(loginResult[0]));
    console.log(jwtUser," Login data!");
    const token = jwt.sign(jwtUser, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
        priority: "high",
      })
      .json({
        status: "success",
        message: "Logged in successfully ✅",
      });
  } catch (e) {
    console.log("Error: ", e);
    res.status(400).redirect("/");
  }
};

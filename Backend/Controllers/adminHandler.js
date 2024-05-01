const jwt = require("jsonwebtoken");

/* const queryPro = (connection, sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const getUser = async (connection, userData) => {
  const sql = `SELECT * 
               FROM sakila.user_k
               WHERE sakila.user_k.Email= "${userData.email}" AND sakila.user_k.Password = "${userData.password}"`;

  return await queryPro(connection, sql);
}; */

exports.renderAdminLoginUI = (req, res) => {
  res.status(200).render("loginAdmin");
};

exports.login = async (req, res) => {
  try {
    const connection = require(`./../server`);
    const databaseHandler = require("./databaseHandler");

    const result = await databaseHandler.loginAdmin(
      req,
      res,
      connection,
      req.body
    );

    if (result.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Invalid Credentials 🧑🏿‍🦲",
      });
    }

    const loggedInUser = JSON.parse(JSON.stringify(result[0]));
    console.log(loggedInUser);
    const token = jwt.sign(loggedInUser, process.env.JWT_SECRET_KEY, {
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
        message: "Logged in successfuly ✅",
      });
  } catch (err) {
    return res.status(500).json({
      status: "failure",
      message: "Internal Server Error:" + err.message,
    });
  }
};

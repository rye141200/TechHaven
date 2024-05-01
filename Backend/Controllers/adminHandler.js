const jwt = require("jsonwebtoken");

const queryPro = (connection, sql) => {
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
};

exports.renderAdminLoginUI = (req, res) => {
  res.status(200).render("loginAdmin");
};

exports.login = async (req, res) => {
  try {
    const connection = require(`./../server`);
    const result = await getUser(connection, req.body);
    if (result.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Invalid Credentials 🧑🏿‍🦲",
      });
    }

    const jwtUser = JSON.parse(JSON.stringify(result[0]));
    const token = jwt.sign(jwtUser, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return res
      .cookie("token", token, {
        httpOnly: false,
        secure: false,
        priority: "high",
      })
      .redirect("/admin/dashboard");
  } catch (err) {
    return res.status(500).json({
      status: "failure",
      message: "Internal Server Error:" + err.message,
    });
  }
};

exports.renderAdminDashboardUI = (req, res) => {
  // temporary response
  res.status(200).json({
    status: "success",
    message: "Admin dashboard",
  });
};

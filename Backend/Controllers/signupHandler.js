const createUUID = (connection, resolve) => {
  connection.query("SELECT UUID();", (err, result) => {
    if (err) return;
    return resolve(result);
  });
};
const insertIntoUser = (connection, value, userData, res) => {
  const ID = Object.values(JSON.parse(JSON.stringify(value[0])))[0];
  connection.query(
    `INSERT INTO sakila.user_k(ID,First_Name, Last_Name, Email, Password)
        VALUES ('${ID}','${userData.firstName}','${userData.lastName}','${userData.email}','${userData.password}'); `,
    (err, result) => {
      if (err) return;
    }
  );
  connection.query(
    `INSERT INTO sakila.regular_user(ID,Balance)
  VALUES('${ID}',100);
`,
    (err, result) => {
      if (err) return;
    }
  );
  return res.status(201).json({
    status: "Success",
    message: "Successfully added users!",
  });
};
exports.checkEmails = (req, res, next) => {
  const connection = require(`./../server`);
  const userData = req.body;
  new Promise((resolve) => {
    connection.query(
      `
      SELECT Email FROM sakila.user_k
      WHERE Email = "${userData.email}"
      `,
      (err, result) => {
        if (err) return;
        if (result.length > 0) {
          return res.status(404).json({
            status: "fail",
            message: "User Exist already!",
          });
        } else {
          return resolve("OK");
        }
      }
    );
  }).then((result) => {
    if (result === "OK") next();
  });
};

exports.signup = (req, res, next) => {
  const connection = require(`./../server`);
  const userData = req.body;
  try {
    new Promise((resolve) => {
      createUUID(connection, resolve); //!Generate ID
    }).then((value) => {
      insertIntoUser(connection, value, userData, res);
    });
  } catch (e) {
    res.status(400).json({
      status: "failure",
      message: "Couldn't signup",
    });
  }
};

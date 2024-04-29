const mysql = require("mysql");
require("dotenv").config({ path: "config.env" });
const app = require("./app");
const port = process.env.PORT;

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
});

connection.connect((err) => {
  if (err) return;
  console.log("Connected successfully from database! 😎😄");
});

module.exports = connection;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "db_school",
});

connection.connect((error) => {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Database Connected...");
  }
});

module.exports = connection;

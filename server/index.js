const express = require("express");
const bodyParser = require("body-parser");
const db = require("./queries/combinedQueries");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use(bodyParser);
app.post("/adduser", db.addUser);

app.listen(8080, () => {
  console.log("Server started at http://localhost:8080");
});

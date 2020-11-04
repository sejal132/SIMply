const express = require("express");
const bodyParser = require("body-parser");
const db = require("./queries/combinedQueries");
const http = require("http");
//const express = require('express')
const morgan = require("morgan");
const auth = require("./Auth/auth");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const cookierParser = require("cookie-parser");

const app = express();
app.use(
  session({
    name: "session-id",
    secret: "123456xxx",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);
app.use(morgan("dev"));
app.use(cookierParser("123456xxx"));
app.get("/", (req, res) => {
  res.statusCode = 200;
  res.end("Welcome Edemone to your express app!");
});
app.use(auth);
app.get("/secret", (req, res) => {
  res.statusCode = 200;
  res.end("This is ");
});
app.post("/adduser", db.addUser);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

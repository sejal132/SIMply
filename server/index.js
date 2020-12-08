const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require('cors');
const db = require("./queries/combinedQueries");

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json()) 
app.use(cors());
app.post("/adduser", db.addUser);
app.get('/recommend',db.recommendPlans);
app.get('/foreign',db.recommendForeign);

app.listen(8080, () => {
  console.log("Server started at http://localhost:8080");
});

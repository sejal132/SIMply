const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries/combinedQueries');

const app = express();

app.get('/', (req, res) => {

    //res.send("Hello world!");

});
app.get('/adduser', db.addUser);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
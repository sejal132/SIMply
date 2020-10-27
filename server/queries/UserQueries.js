const config = require('../database/config');

const addUser = (req, res) => {
    config.func();

}

module.exports = {
    addUser

}
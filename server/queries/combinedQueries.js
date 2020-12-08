const user = require('./UserQueries');

const addUser = user.addUser;
const recommendPlans=user.recommendPlans;
const recommendForeign=user.recommendForeign;



module.exports = {
    addUser,
    recommendPlans,
    recommendForeign
}
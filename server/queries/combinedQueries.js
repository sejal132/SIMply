const user = require('./UserQueries');

const addUser = user.addUser;
const recommendPlans=user.recommendPlans;
const recommendForeign=user.recommendForeign;
const subscribed=user.subscribed;
const map=user.map;



module.exports = {
    addUser,
    recommendPlans,
    recommendForeign,
    subscribed,
    map
}
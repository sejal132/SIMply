const user = require('./UserQueries');

const addUser = user.addUser;
const recommendPlans=user.recommendPlans;



module.exports = {
    addUser,
    recommendPlans
}
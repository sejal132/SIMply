const driver = require('../database/config');

const session = driver.session();
const firstName = 'Alice';
const lastName = 'WonderLand';
const personemail = 'sejalagrawal01@gmail.com';
const planexpiry = 2;
const personlat = 43.213239;
const personlong = 23.21312;
const id = 'random id';
const usage = 'low';

const addUser = async (req, res) => {
	try {
		const result = await session.run(
			'CREATE (a:User {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountOfUsage: $amtusage}) RETURN a',
			{
                firstname: firstName,
                lastname: lastName,
				email: personemail,
				expiry: planexpiry,
                personlat: personlat,
                personlong: personlong,
                id: id,
				amtusage: usage,
			}
		);

		const singleRecord = result.records[0];
		const node = singleRecord.get(0);

		console.log(node.properties.name);
    } catch(err) {
        res.send(err);
    } finally {
        res.send("Added user");
		await session.close();
		await driver.close();
	}
};

module.exports = {
	addUser,
};

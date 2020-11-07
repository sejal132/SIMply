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
		await session.run(
			`
			CREATE (a:User {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountOfUsage: $amtusage})
			WITH a
			MATCH (b: User) WHERE distance(point({latitude: a.lat, longitude: a.long}), point({latitude: b.lat, longitude: b.long}))/1000 <=2 AND a.id <> b.id 
			MERGE (a)-[r:NEAR]->(b)
			WITH a, planId
			MATCH (c: Plan) WHERE c.id = planId
			MERGE (a)-[r:USES]->(c)`,
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
	} catch (err) {
		res.status(500).send(err);
	} finally {
		res.status(200).send('Added user');
		await session.close();
		await driver.close();
	}
};

module.exports = {
	addUser,
};

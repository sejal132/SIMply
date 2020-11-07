const driver = require('../database/config');
const { v4: uuidv4 } = require('uuid');

const getProviderId = (provider) => {
	switch (provider) {
		case 'Jio':
			return 1
		case 'Airtel':
			return 2
		case 'Vodafone':
			return 3
		case 'Idea':
			return 4
		case 'BSNL':
			return 5
	}
}

const addUser = async (req, res) => {
	const id = uuidv4();
	const session = driver.session();
	const d = req.body;
	const pid = getProviderId(d.provider);
	try {
		await session.run(
			`
			CREATE (a:User {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountPerDay: $amountPerDay})
			WITH a
			MATCH (b: User) WHERE distance(point({latitude: a.lat, longitude: a.long}), point({latitude: b.lat, longitude: b.long}))/1000 <=2 AND a.id <> b.id 
			MERGE (a)-[r:NEAR]->(b)
			WITH a
			MATCH (p:Plan) WHERE p.provider_id = $pid AND p.amountOfData = a.amountPerDay AND p.type = $type AND p.costPerMonth = $cpm
			MERGE (a)-[r:USES]->(p)`,
			{
				firstname: d.firstName,
				lastname: d.lastName,
				email: d.email,
				expiry: d.planExpiry,
				personlat: d.lat,
				personlong: d.long,
				id: id,
				amountPerDay: d.amountPerDay,
				pid: pid,
				type: d.type,
				cpm: d.costPerMonth,
			}
		);
	} catch (err) {
		res.status(500).send(err);
	} finally {
		res.status(200).send(id);
		await session.close();
		await driver.close();
	}
};

module.exports = {
	addUser,
};

const fs = require('fs');
const path = require('path');
const driver = require('./config');

const filePath = path.join(__dirname, 'userdata.json');

const addData = async () => {
	fs.readFile(filePath, { encoding: 'utf-8' }, async (err, data) => {
		if (err) {
			console.log(err);
		}
		let session;
		try {
			session = driver.session();
			await session.run('MATCH (a:User) DETACH DELETE a');
			await session.close();
		} catch (error) {
			console.log(error);
		}
		const userData = JSON.parse(data);
		for (let index = 0; index < userData.length; index++) {
			const d = userData[index];
			session = driver.session();
			try {
				await session.run(
					'CREATE (a:User {firstName: $first_name, lastName: $last_name, email: $email, id: $id, lat: $lat, long: $long, expiryOfPlan: $eop, amountPerDay: $aou, planId: $planId,country:$country,profession:$profession})',
					{
						first_name: d.first_name,
						last_name: d.last_name,
						email: d.email,
						id: d.id.$oid,
						lat: d.latitude,
						long: d.longitude,
						eop: d.plan_of_expiry,
						aou: d.amount_per_day,
						planId: d.planId,
						country:d.country,
						profession:d.profession
					}
				);
				await session.close();
			} catch (error1) {
				console.log(error1);
			}
		}
		try {
			session = driver.session();
			await session.run('DROP INDEX userIndex');
			await session.close();
			session = driver.session();
			await session.run('CREATE INDEX userIndex FOR(n:User) ON (n.id)');
			await session.close();
		} catch (error1) {
			console.log(error1);
		}
	});
	await driver.close();
	console.log('done');
};

addData();

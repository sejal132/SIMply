const fs = require('fs');
const path = require('path');
const driver = require('./config');

const filePath = path.join(__dirname, 'plandata.json');

const addData = async () => {
	fs.readFile(filePath, { encoding: 'utf-8' }, async (err, data) => {
		if (err) {
			console.log(err);
		}
		let session;
		try {
			session = driver.session();
			await session.run('MATCH (a:Plan) DETACH DELETE a');
			await session.close();
		} catch (error) {
			console.log(error);
		}
		const planData = JSON.parse(data);
		for (let index = 0; index < planData.length; index++) {
			const d = planData[index];
			session = driver.session();
			try {
				await session.run(
					'CREATE (a:Plan {type: $type, validity: $validity, numberOfUsers: $nou, rating: $rating, amountOfData: $aod, costPerMonth: $cpm, id: $id,provider_id:$provider_id})',
					{
						type: d.type,
						validity: d.validity_in_months,
						nou: d.number_of_users,
						rating: d.rating,
						aod: d.amount_of_data,
						cpm: d.cost_per_month,
						id: d.id.$oid,
						provider_id: d.provider_id,
					}
				);
				await session.close();
			} catch (error1) {
				console.log(error1);
			}
		}
		try {
			session = driver.session();
			await session.run('DROP INDEX planIndex');
			await session.close();
			session = driver.session();
			await session.run('CREATE INDEX planIndex FOR(n:Plan) ON (n.id)');
			await session.close();
		} catch (error1) {
			console.log(error1);
		}
	});
	await driver.close();
	console.log('done');
};

addData();

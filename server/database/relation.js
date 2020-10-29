const fs = require('fs');
const path = require('path');
const driver = require('./config');

const filePath = path.join(__dirname, 'providerdata.json');
const filePath2 = path.join(__dirname, 'plandata.json');

const plan_provider = async () => {
	fs.readFile(filePath, { encoding: 'utf-8' }, async (err, data) => {
		if (err) {
			console.log(err);
		}
		let session;
		try {
			session = driver.session();
			await session.run('MATCH (a:Plan)-[r:BELONGS_TO]->() DELETE r');
			await session.close();
		} catch (error) {
			console.log(error);
		}
		const providerData = JSON.parse(data);
		providerData.forEach(async d => {
			session = driver.session();
			try {
				await session.run(
					'MATCH (a:Plan), (b:Provider) WHERE a.provider_id = $id AND b.id = $id CREATE (a)-[r:BELONGS_TO ]->(b)',{
                        id:d.id
                    }

				);
			} catch (error1) {
				console.log(error1);
			}
			await session.close();
		});
	});
	console.log('done');
};

const user_plan = async () => {
	fs.readFile(filePath2, {encoding: 'utf-8'}, async (err, data) => {
		if (err) {
			console.log(err);
		}
		let session;
		try {
			session = driver.session();
			await session.run('MATCH (a:User)-[r:USES]->() DELETE r');
			await session.close();
		} catch (error) {
			console.log(error);
		}
		const planData = JSON.parse(data);
		planData.forEach(async d => {
			session = driver.session();
			try {
				await session.run(
					'MATCH (a:User), (b:Plan) WHERE a.planId = $id AND b.id = $id CREATE (a)-[r:USES]->(b)',
					{
						id: d.id.$oid
					}
				)
			} catch(error1) {
				console.log(error1);
			}
			await session.close();
		});
	});
	await driver.close();
	console.log('done');
}

plan_provider();
user_plan();

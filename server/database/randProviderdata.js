const fs = require('fs');
const path = require('path');
const driver = require('./config');

const filePath = path.join(__dirname, 'providerdata.json');

const addData = async () => {
	fs.readFile(filePath, { encoding: 'utf-8' }, async (err, data) => {
		if (err) {
			console.log(err);
		}
		let session;
		try {
			session = driver.session();
			await session.run('MATCH (a:Provider) DETACH DELETE a');
			await session.close();
		} catch (error) {
			console.log(error);
		}
		const providerData = JSON.parse(data);
		for (let index = 0; index < providerData.length; index++) {
			const d = providerData[index];
			session = driver.session();
			try {
				await session.run(
					'CREATE (a:Provider {name:$name, id:$id, numberOfUsers: $nou, networkStrength: $ns})',
					{
						name: d.name,
						id: d.id,
						nou: d.number_of_users,
						ns: d.network_strength,
					}
				);
				await session.close();
			} catch (error1) {
				console.log(error1);
			}
		}
		try {
			session = driver.session();
			await session.run('DROP INDEX providerIndex');
			await session.close();
			session = driver.session();
			await session.run(
				'CREATE INDEX providerIndex FOR(n:Provider) ON (n.id)'
			);
			await session.close();
		} catch (error1) {
			console.log(error1);
		}
	});
	await driver.close();
	console.log('done');
};

addData();

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
			await session.run('MATCH (a:User) DELETE a');
			await session.close();
		} catch (error) {
			console.log(error);
		}
		const providerData = JSON.parse(data);
		providerData.forEach(async d => {
			session = driver.session();
			try {
				await session.run(
					'CREATE (a:Provider {name:$name,id:$id}) RETURN a',
					{
                        name:d.name,
                        id:d.id
					}
				);
			} catch (error1) {
				console.log(error1);
			}
			await session.close();
		});
	});
	await driver.close();
	console.log('done');
};

addData();

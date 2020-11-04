const fs = require('fs');
const path = require('path');
const driver = require('./config');

const filePath = path.join(__dirname, 'providerdata.json');
const filePath2 = path.join(__dirname, 'plandata.json');

const providerData = JSON.parse(
	fs.readFileSync(filePath, { encoding: 'utf-8' })
);

const planData = JSON.parse(fs.readFileSync(filePath2, { encoding: 'utf-8' }));

const plan_provider = async () => {
	let session;
	try {
		session = driver.session();
		await session.run('MATCH (a:Plan)-[r:BELONGS_TO]->() DELETE r');
		await session.close();
	} catch (error) {
		console.log(error);
	}
	for (let index = 0; index < providerData.length; index++) {
		const d = providerData[index];
		session = driver.session();
		try {
			await session.run(
				'MATCH (a:Plan), (b:Provider) WHERE a.provider_id = $id AND b.id = $id CREATE (a)-[r:BELONGS_TO ]->(b)',
				{
					id: d.id,
				}
			);
			await session.close();
		} catch (error1) {
			console.log(error1);
		}
	}
	console.log('Done plan -> provider');
};

const user_plan = async () => {
	let session;
	try {
		session = driver.session();
		await session.run('MATCH (a:User)-[r:USES]->() DELETE r');
		await session.close();
	} catch (error) {
		console.log(error);
	}
	for (let index = 0; index < planData.length; index++) {
		const d = planData[index];
		session = driver.session();
		try {
			await session.run(
				'MATCH (a:User), (b:Plan) WHERE a.planId = $id AND b.id = $id CREATE (a)-[r:USES]->(b)',
				{
					id: d.id.$oid,
				}
			);
			await session.close();
		} catch (error1) {
			console.log(error1);
		}
	}
	console.log('Done user -> plan');
};

const plan_plan = async () => {
	let session;
	try {
		session = driver.session();
		await session.run('MATCH (a:Plan)-[r:SIMILAR]->() DELETE r');
		await session.close();
	} catch (error) {
		console.log(error);
	}
	try {
		session = driver.session();
		await session.run(
			`MATCH (a:Plan)
			WITH a
			MATCH (b:Plan) WHERE a.id <> b.id
			WITH (2 - abs(a.amountOfData - b.amountOfData)) as amtDiff, a, b
			WHERE amtDiff = 2 OR (amtDiff = 1.5 AND a.provider_id = b.provider_id)
			MERGE (a)-[r:SIMILAR {similarity: amtDiff+1}]->(b)`
		);
		await session.close();
		session = driver.session();
		await session.run(
			'MATCH (a:Plan)-[r]-(b:Plan) WITH a, type(r) as type, collect(r) as rels, b WHERE size(rels) > 1 UNWIND tail(rels) as rel DELETE rel'
		);
		await session.close();
	} catch (error1) {
		console.log(error1);
	}
	console.log('Done plan <-> plan');
};

const user_user = async () => {
	let session;
	try {
		session = driver.session();
		await session.run('MATCH (a:User)-[r:NEAR]->() DELETE r');
		await session.close();
	} catch (error) {
		console.log(error);
	}
	try {
		session = driver.session();
		await session.run(
			'MATCH (a:User) WITH a MATCH (b: User) WHERE distance(point({latitude: a.lat, longitude: a.long}), point({latitude: b.lat, longitude: b.long}))/1000 <=2 AND a.id <> b.id MERGE (a)-[r:NEAR]->(b)'
		);
		await session.close();
		session = driver.session();
		await session.run(
			'MATCH (a:User)-[r]-(b:User) WITH a, type(r) as type, collect(r) as rels, b WHERE size(rels) > 1 UNWIND tail(rels) as rel DELETE rel'
		);
		await session.close();
	} catch (error1) {
		console.log(error1);
	}
	console.log('Done user <-> user');
};

const combined = async () => {
	await plan_provider();
	await user_plan();
	await plan_plan();
	await user_user();
	await driver.close();
};

combined();

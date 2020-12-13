const driver = require('../database/config');
const crypto = require('crypto');
const NetworkSpeed = require('network-speed');
const testNetworkSpeed = new NetworkSpeed();

const getProviderId = provider => {
	switch (provider) {
		case 'Jio':
			return 1;
		case 'Airtel':
			return 2;
		case 'Vodafone':
			return 3;
		case 'Idea':
			return 4;
		case 'BSNL':
			return 5;
	}
};

const getHash = val => {
	const shaSum = crypto.createHash('sha1');
	return shaSum.update(val, 'utf8').digest('hex');
};

const addUser = async (req, res) => {
	const id = getHash(req.body.email);
	let session = driver.session();
	const d = req.body;
	const pid = getProviderId(d.provider);

	const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
	const fileSizeInBytes = 50000000;
	const speed = await testNetworkSpeed.checkDownloadSpeed(
		baseUrl,
		fileSizeInBytes
	);
	var netstrength = speed.mbps;
	console.log(netstrength);

	try {
		await session.run(`
			MERGE (a:User {id: $id})
			ON CREATE SET a += {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountPerDay: $amountPerDay,country:$country,profession:$profession}
			ON MATCH SET a += {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountPerDay: $amountPerDay,country:$country,profession:$profession}
		`, {
			firstname: d.firstName,
			lastname: d.lastName,
			email: d.email,
			expiry: d.planExpiry,
			personlat: d.lat,
			personlong: d.long,
			id: id,
			amountPerDay: d.amountPerDay,
			country: d.country,
			profession: d.profession,
		});
		await session.close();
		session = driver.session();
		await session.run(`
			MATCH (a:User {id: $id}) MATCH (b: User) WHERE distance(point({latitude: a.lat, longitude: a.long}), point({latitude: b.lat, longitude: b.long}))/1000 <=2 AND a.id <> b.id 
			MERGE (a)-[r:NEAR]->(b)
		`, {
			id: id,
		})
		await session.close();
		session = driver.session();
		await session.run(`
			MATCH (a:User {id: $id}) MATCH (p:Plan {provider_id: $pid, amountOfData: $amountPerDay, type: $type, costPerMonth: $cpm})
			WITH p.numberOfUsers + 1 as s, p, a
			SET p.userRating = (((p.userRating*p.numberOfUsers)+$userRating)/(s)), p.numberOfUsers = s
			MERGE (a)-[:USES]->(p)
		`, {
			id: id,
			amountPerDay: d.amountPerDay,
			pid: pid,
			type: d.type,
			cpm: d.costPerMonth,
			userRating: parseInt(d.userRating),
		})
		await session.close();
		session = driver.session();
		await session.run(`
			MATCH (p:Plan {provider_id: $pid, amountOfData: $amountPerDay, type: $type, costPerMonth: $cpm})-[:BELONGS_TO]->(pr:Provider)
			WITH pr.numberOfUsers + 1 as spr, pr
			SET pr.networkStrength = (((pr.networkStrength*pr.numberOfUsers)+$networkStrength)/(spr)), pr.numberOfUsers = spr
		`, {
			amountPerDay: d.amountPerDay,
			pid: pid,
			type: d.type,
			cpm: d.costPerMonth,
			networkStrength: parseInt(netstrength),
		})
		await session.close();
		session = driver.session();
		await session.run(`
			MATCH (a:User {id: $id}) MATCH (b:User) WHERE a.country=b.country AND a.profession=b.profession AND a.id <> b.id MERGE (a)-[:SIMILAR_WORK]->(b)
		`, {
			id: id,
		});
		res.status(200).send(id);
	} catch (err) {
		res.status(500).send(err);
		console.log(err);
	} finally {
		//res.status(200).send(id);
		// res.redirect('/recommend');
		await session.close();
	}
};

const recommendPlans = async (req, res) => {
	const id = req.query.uid;
	let session = driver.session();

	try {
		const queryResult1 = await session.run(
			`match (u:User{id: $id})-[:USES]->(p:Plan)
			match (p)-[:SIMILAR]-(p1:Plan) 
			match (pr:Provider{id:p.provider_id}),(pr1:Provider{id:p1.provider_id})
			with abs(pr1.networkStrength-pr.networkStrength) as netdiff,p1,p
			where (p1.userRating + p1.systemRating) > (p.userRating + p.systemRating) 
			and netdiff<=50
			match (u)-[:NEAR]-(u1:User)-[:USES]->(p2:Plan) 
			where p1.id=p2.id 
			set p2.systemRating = p2.systemRating + 0.5
			return p2`,
			{
				id: id,
			}
		);
		await session.close();
		session = driver.session();
		const queryResult2 = await session.run(`
			match (u:User {id: $id})-[:NEAR]-(u1:User)-[:USES]->(p:Plan) 
			SET p.systemRating = p.systemRating + 0.5
			RETURN p
		`, {
			id: id,
		})
		await session.close();
		session = driver.session();
		const queryResult3 = await session.run(`
			match (u:User{id: $id})-[:USES]->(p:Plan)
			match (p)-[:SIMILAR]-(p1:Plan) 
			SET p1.systemRating = p1.systemRating + 0.5
			return p1
		`, {
			id: id,
		})
		const planData = [];
		queryResult1.records.forEach(record => {
			console.log(record.get(0).properties);
			planData.push(record.get(0).properties);
		});
		queryResult3.records.forEach(record => {
			console.log(record.get(0).properties);
			let i;
			for (i = 0; i < planData.length; ++i) {
				const plan = planData[i];
				if (plan.id === record.get(0).properties.id)
					break;
			}
			if (i === planData.length) {
				planData.push(record.get(0).properties);
			}
		});
		queryResult2.records.forEach(record => {
			console.log(record.get(0).properties);
			let i;
			for (i = 0; i < planData.length; ++i) {
				const plan = planData[i];
				if (plan.id === record.get(0).properties.id)
					break;
			}
			if (i === planData.length) {
				planData.push(record.get(0).properties);
			}
		});
		planData.sort((a, b) => b.userRating - a.userRating);
		res.status(200).send(planData.slice(0, 9));
	} catch (err) {
		res.status(500).send(err);
		console.log(err);
	} finally {
		//res.status(200).send(id);
		//res.redirect('/recommend');
		await session.close();
	}
};
const recommendForeign = async (req, res) => {
	const id = req.query.uid;
	const country = req.query.country;
	const profession = req.query.profession;
	const session = driver.session();
	try {
		const queryResult = await session.run(
			`match (a:User{id:$id}) with a
			match(b:User{country:$country,profession:$profession})-[:USES]->(p:Plan) 
			where a.id<>b.id return p`,
			{
				id: id,
				country: country,
				profession: profession,
			}
		);
		const planData = [];
		queryResult.records.forEach(record => {
			planData.push(record.get(0).properties);
			console.log(planData);
		});
		res.status(200).send(planData);
	} catch (error) {
		res.status(500).send(error);
		console.log(error);
	}
};
const subscribed = async (req, res) => {
	const uid = req.body.uid;
	const planId = req.body.planId;
	let session = driver.session();
	try {
		await session.run(
			'Match (u:User{id:$uid})-[r:USES]->(p:Plan) delete r ',
			{ uid: uid }
		);
		session.close();
		session = driver.session();
		await session.run(
			`Match (u:User{id:$uid}),(p:Plan{id:$planId}) CREATE (u)-[r:USES]->(p)
			with p
			set p.systemRating=p.systemRating+1
			`,
			{
				uid: uid, planId: planId
			}
		);
		session.close();
		res.status(200).send('Successful');

	} catch (error) {
		console.log(error);
		res.status(500).send(error);

	}




};

module.exports = {
	addUser,
	recommendPlans,
	recommendForeign,
	subscribed
};

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
	const session = driver.session();
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
		await session.run(
			`
			MERGE (a:User {id: $id})
			ON CREATE SET a += {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountPerDay: $amountPerDay,country:$country,profession:$profession}
			ON MATCH SET a += {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountPerDay: $amountPerDay,country:$country,profession:$profession}
			WITH a
			MATCH (b: User) WHERE distance(point({latitude: a.lat, longitude: a.long}), point({latitude: b.lat, longitude: b.long}))/1000 <=2 AND a.id <> b.id 
			MERGE (a)-[r:NEAR]->(b)
			WITH a
			MATCH (p:Plan {provider_id: $pid, amountOfData: $amountPerDay, type: $type, costPerMonth: $cpm})
			SET p.userRating = (((p.userRating*p.numberOfUsers)+$userRating)/(p.numberOfUsers+1)), p.numberOfUsers = p.numberOfUsers + 1
			MERGE (a)-[:USES]->(p)
			WITH a, p
			MATCH (p:Plan)-[:BELONGS_TO]->(pr:Provider)
			SET pr.networkStrength = (((pr.networkStrength*pr.numberOfUsers)+$networkStrength)/(pr.numberOfUsers+1)), pr.numberOfUsers = pr.numberOfUsers + 1
			WITH a
			MATCH (b:User) WHERE a.country=b.country AND a.profession=b.profession AND a.id <> b.id MERGE (a)-[:SIMILAR_WORK]->(b)`,
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
				userRating: d.userRating,
				networkStrength: netstrength,
				country: d.country,
				profession: d.profession,
			}
		);
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
	const session = driver.session();

	try {
		const queryResult = await session.run(
			`match (u:User{id: $id})-[:USES]->(p:Plan)
			match (p)-[:SIMILAR]-(p1:Plan) 
			where (p1.userRating + p1.systemRating) > (p1.userRating + p1.systemRating)
			match (u)-[:NEAR]-(u1:User)-[:USES]->(p2:Plan) 
			where p1.id=p2.id 
			set p2.systemRating = p2.systemRating + 0.5
			return p2`,
			{
				id: id,
			}
		);
		const planData = [];
		queryResult.records.forEach(record => {
			console.log(record.get(0).properties);
			planData.push(record.get(0).properties);
		});
		res.status(200).send(planData);
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

module.exports = {
	addUser,
	recommendPlans,
	recommendForeign,
};

const driver = require('../database/config');
const crypto = require('crypto');

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
	try {
		await session.run(
			`
			MERGE (a:User {id: $id})
			ON CREATE SET a += {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountPerDay: $amountPerDay}
			ON MATCH SET a += {firstName: $firstname, lastName: $lastname, email: $email, expiryOfPlan: $expiry, lat: $personlat, long: $personlong, id: $id, amountPerDay: $amountPerDay}
			WITH a
			MATCH (b: User) WHERE distance(point({latitude: a.lat, longitude: a.long}), point({latitude: b.lat, longitude: b.long}))/1000 <=2 AND a.id <> b.id 
			MERGE (a)-[r:NEAR]->(b)
			WITH a
			MATCH (p:Plan) WHERE p.provider_id = $pid AND p.amountOfData = $amountPerDay AND p.type = $type AND p.costPerMonth = $cpm
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
	const id=req.query.uid;
	const session = driver.session();
	try {
		const queryResult=await session.run(
			`match (u:User{id: $id})-[:USES]->(p:Plan)
			match (p)-[:SIMILAR]-(p1:Plan) where p1.rating>p.rating 
			match (u)-[:NEAR]-(u1:User)-[:USES]->(p2:Plan) 
			where p1.id=p2.id return p2`,
			{
				id: id,
			}
		);
		const planData = []
		queryResult.records.forEach((record,i)=>{
			console.log(record.get(i).properties);
			planData.push(record.get(i).properties);
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
const recommendForeign=async(req,res)=>{
	const id=req.query.uid;
	const country=req.query.country;
	const profession=req.query.profession;
	const session=driver.session();
	try{
		const queryResult=await session.run(
			`match (a:User{id:$id})-[:USES]->(p1:Plan) with a 
			match(b:User{country:$country,profession:$profession})-[:USES]->(p:Plan) 
			where a.id<>b.id return p1`,
			{
				id:id,
				country:country,
				profession:profession
			}
		);

	}catch(error){
		console.log(error);
	}

}

module.exports = {
	addUser,
	recommendPlans,
	recommendForeign
};

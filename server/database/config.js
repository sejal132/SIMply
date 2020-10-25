require('dotenv').config();
const neo4j = require('neo4j-driver');

const neo4jURI = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPass = process.env.NEO4J_PASSWORD;

console.log(neo4jURI, neo4jPass, neo4jUser);

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'prisejath711'));

// const session = driver.session();
// const personName = 'Alice';

// const func = async () => {
// 	try {
// 		const result = await session.run(
// 			'CREATE (a:Person {name: $name}) RETURN a',
// 			{ name: personName }
// 		);

// 		const singleRecord = result.records[0];
// 		const node = singleRecord.get(0);

// 		console.log(node.properties.name);
// 	} finally {
// 		await session.close();
// 		await driver.close();
// 	}
// };

// func();

// // on application exit:


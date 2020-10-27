const neo4j = require('neo4j-driver');

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'prisejath711'));

const session = driver.session();
const personName = 'Alice';
const personemail = 'sejalagrawal01@gmail.com';
const planexpiry = 2;
const personloc = 3323;
const usage = 'low';


const func = async () => {
    try {
        const result = await session.run(
            'CREATE (a:Person {name: $name,email:$email,expiry:$expiry,location:$location,amtusage:$amtusage}) RETURN a',
            { name: personName, email: personemail, expiry: planexpiry, location: personloc, amtusage: usage }
        );

        const singleRecord = result.records[0];
        const node = singleRecord.get(0);

        console.log(node.properties.name);
    } finally {
        await session.close();
        await driver.close();
    }
};

module.exports = {
    func
}




// on application exit:


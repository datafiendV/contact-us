const {namespaceWrapper} = require('../namespaceWrapper');
let db = require('../db_model');

async function testdb() {
  const round = 1000;
  const pubkey = "test-pubkey3";
  db = await namespaceWrapper.getDb();
  console.log("DB", db)

    // TEST create contact db
    try {
        const contactId = pubkey;
        const contact = 'test-contact2';
        console.log("Set contact", {contactId, contact})
        await db.insert({ contactId, contact });
        return console.log("contact set");
      } catch (err) {
        return undefined;
      }
}

testdb();

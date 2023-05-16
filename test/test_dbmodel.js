// Tests for db_model.js
const { signTypedData } = require('eth-sig-util');
const db = require('../db_model');

async function testdb() {
  const round = 1000;
  const pubkey = 'test-pubkey2';

  // TEST get contact db
  // let data = await db.getContact(pubkey);
  // console.log("Get Contact", data);

  // TEST set contact db
  // let contact = {
  //   name: "test2",
  //   email: "2",
  //   phone: "2",
  //   message: "test2",
  // }
  // await db.setContact(pubkey, contact);

  // TEST get contact list
  // let contactList = await db.getAllContacts();
  // console.log("Get All Contacts", contactList);

  // TEST get proofs db
  // let proofs = await db.getProofs(pubkey);
  // console.log("Get Proofs", proofs);

  // TEST set proofs db
  // let proof = {
  //   proof: "test2",
  //  pubkey: "test-pubkey2",
  //  signature: "test-signature2",
  // }
  // await db.setProofs(pubkey, proof);

  // TEST get proofs list
  // let proofsList = await db.getAllProofs();
  // console.log("Get All Proofs", proofsList);


}

testdb();

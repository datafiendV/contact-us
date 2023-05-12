const { app, MAIN_ACCOUNT_PUBKEY, SERVICE_URL, TASK_ID } = require("./init");
const {default: axios} = require('axios');
const db = require('./db_model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');


const share = async () => {
      try {
        // find another node
        const nodesUrl = `${SERVICE_URL}/nodes/${TASK_ID}`;

        // check if the node is online
        const res = await axios.get(nodesUrl);
        if (res.status != 200) {
          console.error('Error', res.status);
          return;
        }
  
        if (!res.data) {
          console.error('res has no valid urls');
          return;
        }

        let nodeUrlList = res.data.map((e) => {
          return e.data.url;
        });
        
        console.log(nodeUrlList);
        
        // fetch local contacts
        let allContacts = await db.getAllContacts();
        allContacts = allContacts || '[]';

        // for each node, get all contacts
        for (let url of nodeUrlList) {
          console.log(url);
          // TODO - check if this was also using the wrong endpoint in other tasks
          // Here we fetch the proofs associated with the round in question
          const res = await axios.get(`${url}/task/${TASK_ID}/proofs/:round`);
          if (res.status != 200) {
            console.error('ERROR', res.status);
            continue;
          }
          const payload = res.data;

       if (!payload || payload.length == 0) continue;
       for (let i = 0; i < payload.length; i++) {
         const value = payload[i].value;
         const isVerified = nacl.sign.detached.verify(
           new TextEncoder().encode(JSON.stringify(value.data)),
           bs58.decode(value.signature),
           bs58.decode(value.publicKey)
         );
            if (!isVerified) {
              console.warn(`${url} is not able to verify the signature`);
              continue;
            }
            let localExistingContact = allContacts.find((e) => {
              e.uuid == value.data.uuid;
            });
            if (localExistingContact) {
              if (localExistingContact.data.timestamp < value.data.timestamp) {
                await db.setContact(value.publicKey, value.data)
              }
            } else {
              await db.setContact(value.publicKey, value.data)
            }
          }
        }
      } catch (error) {
        console.error('Some went wrong:', error);
      }
    }

module.exports = { share }
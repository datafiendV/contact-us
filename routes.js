const express = require('express');
const router = express.Router();
const db = require('./db_model');
const fs = require('fs');
const sha256 = require('sha256');
const { createHash } = require('crypto');

const { namespaceWrapper } = require('./namespaceWrapper');

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});


    // returns the current task state from K2 via the namespacewrapper
    router.get('/taskState', async (req, res) => {
        const state = await namespaceWrapper.getTaskState();
        console.log("TASK STATE", state);

        res.status(200).json({ taskState: state })
    })

    // Accepts an upload of a contact form
    router.post('/contact', async (req, res) => {
        const contact = req.body.payload;

        // Check req.body
        if (!contact) {
            res.status(400).json({ error: 'Invalid request' });
            return;
        } else {
            console.log(contact);
        }

        // Use the code below to sign the data payload
        let id = sha256(contact)

        let proof = {
            id: id,
            contact: contact,
        }
        console.log('Check Proof:', proof);
        // use fs to write the contact and proof to a file
        if (!fs.existsSync('./contact')) fs.mkdirSync('./contact');
        fs.writeFileSync("./contact/" + `contact_${pubkey}.json`, JSON.stringify(contact));
        // fs.writeFileSync('proof.json', JSON.stringify(proof));
        await db.setLinktree(pubkey, contact);

        const round = await namespaceWrapper.getRound();
        // TEST For only testing purposes:
        // const round = 1000

        let proofs = await db.getProofs(pubkey);
        proofs = JSON.parse(proofs || '[]');
        proofs.push(proof);
        console.log(`${pubkey} Proofs: `, proofs);
        await db.setProofs(pubkey, proofs);

        return res.status(200).send({message: 'Proof and contact registered successfully'});
    });
    
    // For debugging
    router.get("/logs", async (req, res) => {
        const logs = fs.readFileSync("./namespace/logs.txt", "utf8")
        res.status(200).send(logs);
    })

    // dumps all contacts (body data is encrypted so this endpoint does not require auth)
    router.get('/contact', async (req, res) => {
        const log = "Nothing to see here, check /:publicKey to get the linktree"
        db.getAllContacts()
        return res.status(200).send(log);
    });

    // accepts an upload of a new contact us submission
    router.get('/proofs/:contactId', async (req, res) => {
    const { publicKey } = req.params;
    let proof = await db.getProofs(publicKey);
    proof = proof || '[]';
    return res.status(200).send(proof);
    }
    );

    // returns 'proofs' aka encrypted contact us submissions to verify receipt of submissions
    router.get('/proofs/', async (req, res) => {
    linktree = await db.getAllNodeProofCids() || '[]';
    return res.status(200).send(linktree);
    });

    // returns proofs for a particular round
    router.get('/proofs/:round', async (req, res) => {
        const { round } = req.params;
        let nodeproof = await db.getNodeProofCid(round) || '[]';
        return res.status(200).send(nodeproof);
        });

    // provide a routing endpoint for the clientside app to query
    router.get('/nodeurl', async (req, res) => {
        const nodeUrlList = await namespaceWrapper.getNodes();
        return res.status(200).send(nodeUrlList);
    });

module.exports = router;
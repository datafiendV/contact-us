const { namespaceWrapper } = require('./namespaceWrapper');
const createFile = require('./helpers/createFile.js');
const deleteFile = require('./helpers/deleteFile');
const fs = require('fs');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const db = require('./db_model');
const { Keypair } = require('@solana/web3.js'); // TEST For local testing

const main = async () => {
  console.log('******/  IN Linktree Task FUNCTION /******');

  // Load node's keypair from the JSON file
  const keypair = await namespaceWrapper.getSubmitterAccount();

  // TEST For local testing, hardcode the keypair
  // const keypair = Keypair.generate(); 

  // Get linktree list fron localdb
  const proofs_list_object =  await db.getAllProofs();

  // Use the node's keypair to sign the linktree list
  const messageUint8Array = new Uint8Array(
    Buffer.from(JSON.stringify(proofs_list_object)),
  );

  const signedMessage = nacl.sign(messageUint8Array, keypair.secretKey);
  const signature = signedMessage.slice(0, nacl.sign.signatureLength);

  const submission_value = {
    proofs: proofs_list_object,
    node_publicKey: keypair.publicKey,
    node_signature: bs58.encode(signature),
  };

  // upload the proofs of the contact on web3.storage
  const path = `./Contact/proofs.json`;

  if (!fs.existsSync('./Contact')) fs.mkdirSync('./Contact');

  console.log('PATH', path);

  await createFile(path, submission_value);

  if (storageClient) {

    const file = await getFilesFromPath(path);
    const proof_cid = await storageClient.put(file);
    console.log('User contact proof uploaded to IPFS: ', proof_cid);

    // deleting the file from fs once it is uploaded to IPFS
    await deleteFile(path);

    return proof_cid;
    
  } else {

    console.log('NODE DO NOT HAVE ACCESS TO WEB3.STORAGE');

  }
};

module.exports = main;
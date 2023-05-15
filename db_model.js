const { namespaceWrapper } = require('./namespaceWrapper');

namespaceWrapper.getDb().then((db) => {
  db.ensureIndex({ fieldName: 'contactId', unique: true, sparse:true }, function (err) {
    if (err) console.error('Index creation error:', err);
  });
  
  db.ensureIndex({ fieldName: 'proofsId', unique: true, sparse:true }, function (err) {
    if (err) console.error('Index creation error:', err);
  });
  
  db.ensureIndex({ fieldName: 'NodeProofsCidId', unique: true, sparse:true }, function (err) {
    if (err) console.error('Index creation error:', err);
  });
  
  db.ensureIndex({ fieldName: 'authListId', unique: true, sparse:true }, function (err) {
    if (err) console.error('Index creation error:', err);
  });
  
});

// db functions for contact
const getContact = async (publicKey) => {
  const contactId = getContactId(publicKey);
  try {
    const resp = await db.findOne({contactId });
    if (resp) {
      return resp.contact;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

const setContact = async (publicKey, contact) => {
  try {
    const contactId = getContactId(publicKey);
    await db.insert({ contactId, contact });
    return console.log("contact set");
  } catch (err) {
    return undefined;
  }
}

const getAllContacts = async (values) => {
  const contactListRaw = await db.find({
    contact: { $exists: true },
  });
  let contactList = contactListRaw.map(contactList =>
    contactList.contact
  );
  return contactList;
}

// namespaceWrapper.levelDB functions for proofs
const getProofs = async (pubkey) => {
  const proofsId = getProofsId(pubkey);
  try {
    const resp = await db.findOne({proofsId });
    if (resp) {
      return resp.proofs;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

const setProofs = async (pubkey, proofs) => {
  try {
    const proofsId = getProofsId(pubkey);
    await db.insert({ proofsId, proofs });
    return console.log("Proofs set");
  } catch (err) {
    return undefined;
  }
}

const getAllProofs = async () => {
  const proofsListRaw = await db.find({
    proofs: { $exists: true },
  });
  let proofsList = proofsListRaw.map(proofsList =>
    proofsList.proofs
  );
  return proofsList;
}

// db functions for node proofs
const getNodeProofCid = async (round) => {
  const NodeproofsListRaw = await db.find({
    cid: { $exists: true },
  });
  let NodeproofsList = NodeproofsListRaw.map(NodeproofsList =>
    NodeproofsList.cid
  );
  return NodeproofsList;
}

const setNodeProofCid = async (round, cid) => {
  try {
    const NodeProofsCidId = getNodeProofCidid(round);
    await db.insert({ NodeProofsCidId, cid });
    return console.log("Node CID set");
  } catch (err) {
    return undefined;
  }
}

const getAllNodeProofCids = async () => {
  const NodeproofsListRaw = await db.find({
    cid: { $exists: true },
  });
  let NodeproofsList = NodeproofsListRaw.map(NodeproofsList =>
    NodeproofsList.cid
  );
  return NodeproofsList;
}

//db functions fro Auth list
const getAuthList = async (pubkey) => {
  const authListId = getauthListid(pubkey);
  try {
    const resp = await db.findOne({authListId });
    if (resp) {
      return resp.authList;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

const setAuthList = async (pubkey) => {
  try {
    const authListId = getauthListid(pubkey);
    await db.insert({ authListId, cid });
    return console.log("auth List CID set");
  } catch (err) {
    return undefined;
  }
}

const getAllAuthLists = async (values) => {
  const authListRaw = await db.find({
    authList: { $exists: true },
  });
  let authList = authListRaw.map(authList =>
    authList.authList
  );
  return authList;
}



const getNodeProofCidid = (round) => {
  return `node_proofs:${round}`;
}

const getContactId = (publicKey) => {
  return `contact:${publicKey}`;
}

const getProofsId = (pubkey) => {
  return `proofs:${pubkey}`;
}

const getAuthListId = (round) => {
  return `auth_list:${round}`;
}

module.exports = {
  getContact,
  setContact,
  getAllContacts,
  getProofs,
  setProofs,
  getAllProofs,
  getNodeProofCid,
  setNodeProofCid,
  getAllNodeProofCids,
  getAuthList,
  setAuthList,
  getAllAuthLists,
  getAuthListId
}
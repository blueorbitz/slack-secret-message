const temp = {};

async function secretCreate({ channelId, title, encrypted, users, expiry, onetime }) {
  // TODO: DynamoDB implementation goes here
  const uuid = Math.random().toString(36).substr(2, 6) + Math.random().toString(36).substr(2, 6);
  temp[uuid] = encrypted;

  return { uuid };
}

async function secretRetrieve(uuid) {
  return {
    encrypted: temp[uuid],
    createdAt: new Date(),
    expiry: 3600,
  };
}

module.exports = {
  secretCreate,
  secretRetrieve,
};

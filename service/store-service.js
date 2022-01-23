const tempSecret = {};
const tempAccess = {};

/***
 * secret schema
 * {
 *   uuid, channelId, title, createdAt, createdBy
 *   rule {
 *     users, expiry, onetime,
 *   }
 * }
 * 
 * message schema - This should be delete base on the TTL
 * {
 *   uuid, secretUuid, encrypted
 * }
 * 
 * access schema
 * {
 *   uuid, secretUuid, userId, valid, createdAt,
 * }
 */

async function createSecret({ channelId, title, encrypted, users, expiry, onetime }) {
  // TODO: DynamoDB implementation goes here
  const uuid = Math.random().toString(36).substr(2, 6) + Math.random().toString(36).substr(2, 6);
  tempSecret[uuid] = { encrypted, users };

  return { uuid };
}

async function retrieveSecret(uuid) {
  return Object.assign({
    createdAt: new Date(),
    expiry: 3600,
  }, tempSecret[uuid]);
}

async function createAuditTrail({ uuid, userId, valid = true }) {
  if (tempAccess[uuid] == null)
    tempAccess[uuid] = [];
  tempAccess[uuid].push({ userId, createdAt: new Date(), valid });
  return {};
}

async function retrieveAuditTrail(uuid) {
  return tempAccess[uuid];
}

module.exports = {
  createSecret,
  retrieveSecret,
  createAuditTrail,
  retrieveAuditTrail,
};

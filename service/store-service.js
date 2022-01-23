const tempSecret = {};
const tempAccess = {};

/***
 * secret schema
 * {
 *   uuid, channelId, title, createdAt,
 *   rule {
 *     users, expiry, onetime,
 *   }
 * }
 * 
 * message schema - This should be delete base on the TTL
 * {
 *   uuid, encrypted
 * }
 * 
 * access schema
 * {
 *   uuid, secretUuid, userId, valid, createdAt,
 * }
 */
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000',
});
const docClient = new AWS.DynamoDB.DocumentClient();

async function createSecret({ channelId, title, encrypted, users, expiry, onetime }) {
  const uuid = uuidv4();
  try {
    await docClient.put({
      TableName: 'Secret',
      Item: {
        uuid,
        channelId,
        title,
        createdAt: new Date().toISOString(),
        rule: {
          users, expiry, onetime,
        },
      }
    }).promise();

    await docClient.put({
      TableName: 'Message',
      Item: {
        uuid,
        encrypted,
      },
    }).promise();
  } catch (err) {
    console.error(err);
  }

  return { uuid };
}

async function retrieveSecret(uuid) {
  const secret = await docClient.get({
    TableName: 'Secret',
    Key: { uuid },
  }).promise();

  const message = await docClient.get({
    TableName: 'Message',
    Key: { uuid },
  }).promise();

  return Object.assign({
    createdAt: new Date(secret.Item.createdAt),
  }, secret.Item.rule, message.Item);
}

async function createAuditTrail({ uuid: secretUuid, userId, valid = true }) {
  const uuid = uuidv4();
  await docClient.put({
    TableName: 'Access',
    Item: {
      uuid,
      secretUuid,
      userId,
      valid,
      createdAt: new Date().toISOString(),
    },
  }).promise();
  return {};
}

async function retrieveAuditTrail(uuid) {
  const params = {
    TableName: 'Access',
    FilterExpression: 'secretUuid = :s',
    ExpressionAttributeValues: {
      ':s': uuid,
    }
  };
  const data = await docClient.scan(params).promise();
  const Items = data.Items;
  return Items;
}

async function deleteMessage(uuid) {
  return {};
}

module.exports = {
  createSecret,
  retrieveSecret,
  createAuditTrail,
  retrieveAuditTrail,
  deleteMessage,
};

const openpgp = require('openpgp');

function generateRandomKey() {
  return Math.random().toString(36).substr(2, 6) + Math.random().toString(36).substr(2, 6);
}

async function encryptMessage(message, decodeKey) {
  if (decodeKey == null) 
    throw new Error('decodeKey should not be null');

  const binary = new TextEncoder('utf-8').encode(message);
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    passwords: [decodeKey],
  });

  return encrypted;
}

async function decryptMessage(data, decodeKey) {
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.readMessage({ armoredMessage: data }),
    passwords: [decodeKey],
  });

  return decrypted;
}

module.exports = {
  generateRandomKey,
  encryptMessage,
  decryptMessage,
};

const { App } = require('@slack/bolt');
const pick = require('lodash.pick')
const utils = require('./utils');
const encryptionService = require('./service/encryption-service');
const storeService = require('./service/store-service');
const createSecretModal = require('./component/create-secret-modal');
const displaySecretMessage = require('./component/display-secret-message');
const revealSecretModal = require('./component/reveal-secret-modal');
const accessLogModal = require('./component/access-log-modal');
const accessDenyModal = require('./component/access-deny-modal');

// Load .env
const dotenv = require('dotenv');
dotenv.config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
  // developerMode: true,
});

app.command('/secret', async (context) => {
  const { command, ack, respond, logger } = context;
  // Acknowledge command request
  await ack();
  try {
    if (command.text === "")
      await createSecretModal(context);
    else
      await respond(`${JSON.stringify(command, null, 2)}`);
    logger.info('secret command:', pick(command, ['response_url', 'trigger_id']));
  }
  catch (error) {
    logger.error(error);
  }
});

app.view('modal-create-secret', async (context) => {
  const {  ack, payload, body, view, client, logger  } = context;
  const modalValue = payload.state.values;

  logger.info('create.private_metadata:', JSON.parse(body.view.private_metadata));
  // logger.info('create.values:', modalValue);
  await ack();

  const value = {
    title: utils.getStateValue(modalValue, 'action-title'),
    message: utils.getStateValue(modalValue, 'action-message'),
    users: utils.getStateValue(modalValue, 'action-user'),
    expiry: utils.getStateValue(modalValue, 'action-expiry'),
    onetime: utils.getStateValue(modalValue, 'action-visible'),
  };

  // save logic
  // use the openpgp https://github.com/jhaals/yopass/blob/master/next/src/utils.tsx
  const decodeKey = encryptionService.generateRandomKey();
  const encrypted = await encryptionService.encryptMessage(value.message, decodeKey);
  const store = await storeService.createSecret(Object.assign({ encrypted }, value));

  displaySecretMessage(Object.assign({ store, decodeKey }, value, context));
});

app.action('button-reveal', async (context) => {
  const { ack, logger, body } = context;

  // Acknowledge the action
  await ack();
  logger.info('reveal.value:', body.actions[0].value);
  
  const userId = body.user.id;
  const [uuid, decodeKey] = body.actions[0].value.split(':');
  
  try {
    const store = await storeService.retrieveSecret(uuid);

    // check if user is allow to view secret
    if (!utils.isValidUser(store.users, userId))
      throw new Error('Do not have permission to view secret');

    // check if secret has expired
    if (!utils.isValidExpiry(store.createdAt, store.expiry))
      throw new Error('Secret has expired');

    // decrypt the message
    const message = await encryptionService.decryptMessage(store.encrypted, decodeKey);

    // store the access log
    await storeService.createAuditTrail({ uuid, userId });

    // show pop up
    await revealSecretModal(Object.assign({ store, message }, context));

    // clean up
    if (store.onetime)
      await storeService.deleteMessage(Uuid)
  }
  catch (error) {
    logger.error({ uuid, userId, message: error.message });
    await storeService.createAuditTrail({ uuid, userId, valid: false });
    await accessDenyModal(Object.assign(error, context));
  }
});

app.action('button-access-log', async (context) => {
  const { ack, body, logger } = context;
  // Acknowledge the action
  await ack();

  try {
    const uuid = body.actions[0].value;
    const accessLogs = await storeService.retrieveAuditTrail(uuid);
    await accessLogModal(Object.assign({ accessLogs }, context));
  }
  catch (error) {
    logger.error(error);
  }
});

(async () => {
  // Start your app
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();

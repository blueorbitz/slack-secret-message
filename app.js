const { App } = require('@slack/bolt');
const createSecretModal = require('./component/create-secret-modal');
const displaySecretMessage = require('./component/display-secret-message');
const revealSecretModal = require('./component/reveal-secret-modal');
const accessLogModal = require('./component/access-log-modal');

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
  // developerMode: false,
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
    logger.info(command);
  }
  catch (error) {
    logger.error(error);
  }
});

app.view('modal-create-secret', async (context) => {
  const {  ack, payload, body, view, client, logger  } = context;
  const submittedValues = payload.state.values
  // logger.info("REST", submittedValues);
  // do stuff with submittedValues
  await ack();
  logger.info("modal ack");
  displaySecretMessage(context);
});

app.action('button-reveal', async (context) => {
  const { ack, logger } = context;
  // Acknowledge the action
  await ack();

  try {
    await revealSecretModal(context);
  }
  catch (error) {
    logger.error(error);
  }
});

app.action('button-access-log', async (context) => {
  const { ack, logger } = context;
  // Acknowledge the action
  await ack();

  try {
    await accessLogModal(context);
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

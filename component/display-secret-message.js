const axios = require('axios');

module.exports = async function ({ body, store, decodeKey, title }) {
  const user = body['user']['id'];
  const metadata = JSON.parse(body['view']['private_metadata'])

  const result = await axios.post(metadata.response_url, {
    response_type: 'in_channel',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<@${user}> share a secret *${title || '<Untitled Secret>'}*`,
        }
      },
      {
        type: 'actions',
        block_id: 'actionblock-secret',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Reveal Secret'
            },
            value: `${store.uuid}:${decodeKey}`,
            action_id: 'button-reveal',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Access Log',
            },
            value: 'access_log',
            action_id: 'button-access-log',
          }
        ]
      }
    ]
  });

  return result;
}
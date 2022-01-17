module.exports = async function({ command, client, body }) {
  const result = await client.views.open({
    // Pass a valid trigger_id within 3 seconds of receiving it
    trigger_id: body.trigger_id,
    // View payload
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Access Log',
        emoji: true
      },
      close: {
        type: 'plain_text',
        text: 'Close',
        emoji: true
      },
      blocks: [
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Access timestamp*'
            },
            {
              type: 'mrkdwn',
              text: '*By*'
            }
          ]
        },
        {
          type: 'section',
          fields: [
            {
              type: 'plain_text',
              text: '2022-01-01 12:12:12'
            },
            {
              type: 'mrkdwn',
              text: '<@User> - Granted'
            }
          ]
        },
        {
          type: 'section',
          fields: [
            {
              type: 'plain_text',
              text: '2022-01-01 12:12:12'
            },
            {
              type: 'mrkdwn',
              text: '<@User> - Granted'
            }
          ]
        }
      ]
    }
  });
  return result;
}
module.exports = async function({ accessLogs, client, body }) {
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
        }
      ].concat(accessLogs.map(accessLog => ({
        type: 'section',
        fields: [
          {
            type: 'plain_text',
            text: accessLog.createdAt.toLocaleString(),
          },
          {
            type: 'mrkdwn',
            text: `<@${accessLog.userId}> - ${accessLog.valid ? 'Granted' : 'Deny'}`
          }
        ]
      })))
    }
  });
  return result;
}
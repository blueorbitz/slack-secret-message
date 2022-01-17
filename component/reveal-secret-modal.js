module.exports = async function({ command, client, body }) {
  const result = await client.views.open({
    // Pass a valid trigger_id within 3 seconds of receiving it
    trigger_id: body.trigger_id,
    // View payload
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Secret Title',
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
          text: {
            type: 'mrkdwn',
            text: '*Message*\n```Secret message here```'
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: 'This message will expired in 3 days.',
              emoji: true
            }
          ]
        }
      ]
    }
  });
  return result;
}
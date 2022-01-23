module.exports = async function({ client, body, message }) {
  const result = await client.views.open({
    // Pass a valid trigger_id within 3 seconds of receiving it
    trigger_id: body.trigger_id,
    // View payload
    view: {
      title: {
        type: 'plain_text',
        text: 'Access Deny',
        emoji: true
      },
      type: 'modal',
      close: {
        type: 'plain_text',
        text: 'Close',
        emoji: true
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: message,
            emoji: true
          }
        }
      ]
    }
  });
  return result;
}
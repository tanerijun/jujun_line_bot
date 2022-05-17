'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
const app = express();

// for better site health check
app.get('/', (req, res) => {
  res.sendStatus(200);
});

// register a webhook handler with middleware
// about the middleware, please refer to the doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // reply message default to error
  // when the timer is set successfully, the message will be changed
  const badReply = `I don't understand, please use this format !!@{time-in-hours}@{what-to-remind}
  For examples:
  Do the laundry in 2 hours => !!@2@do the laundry
  Call mom in half an hour => !!@0.5@call mom
  `;

  let message = {
    type: 'text',
    text: badReply,
  };

  // ignore all messages that doesn't start with this string
  if (event.message.text.startsWith('!!')) {
    // targetID to push message to
    const userID = event.source.userId;

    // process data
    const words = event.message.text.split('@');
    const hours = words[1];
    const content = words[2];

    if (hours != undefined && content != undefined) {
      // update reply message
      message = {
        type: 'text',
        text: `Roger! I'll remind you to "${content}" in ${hours} hours`,
      };

      // set a reminder in x hours
      // covert hour to ms
      const ms = Number(hours) * 60 * 60 * 1000;

      setTimeout(() => {
        sendReminder(userID, content);
      }, ms);
    }
  }

  return client.replyMessage(event.replyToken, message);
}

// sending reminder with pushMessage method of the client
function sendReminder(userID, content) {
  client.pushMessage(userID, {
    type: 'text',
    text: content,
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

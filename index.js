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
  const badReply = `I don't understand, please use this format !!@{time-in-hours}@{what-to-remind}
  For examples:
  Do the laundry in 2 hours => !!@2@do the laundry
  Call mom in half an hour => !!@0.5@call mom
  `;

  let message = {
    type: 'text',
    text: badReply,
  };

  if (event.message.text.startsWith('!!')) {
    console.log('Valid request received...');

    // targetID to push message to
    const userID = event.source.userId;
    console.log(`user: ${userID}`);

    // clean data
    const words = event.message.text.split('@');
    const hours = words[1];
    const content = words[2];
    console.log(
      `Following data received: hours = ${hours}, content = ${content}`
    );

    if (hours != undefined && content != undefined) {
      // update reply message
      message = {
        type: 'text',
        text: `Roger! I'll remind you to "${content}" in ${hours} hours`,
      };

      console.log('Passed all tests...');

      console.log('Setting up the reminder');
      // set a reminder in x hours
      // covert hour to ms
      const ms = Number(hours) * 60 * 60 * 1000;

      setTimeout(() => {
        sendReminder(userID, content);
      }, ms);
      console.log('Finished successfully!');
    } else {
      console.log('Invalid data format, rejected!');
    }
  } else {
    console.log("Received data doesn't start with !!, data rejected!");
  }

  return client.replyMessage(event.replyToken, message);
}

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

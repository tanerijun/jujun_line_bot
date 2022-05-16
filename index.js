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
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// targetID to push message
let userID = null;

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (event.message.startsWith('set-reminder')) {
    userID = event.source.userId;

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'Roger! Leave it to me!',
    });
  }

  // create a echoing text message
  // const echo = { type: 'text', text: event.message.text };

  // use reply API
  // return client.replyMessage(event.replyToken, [
  //   echo,
  //   { type: 'text', text: `Your userID is ${userID}` },
  // ]);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

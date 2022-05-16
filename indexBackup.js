require('dotenv').config();
const https = require('https');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// prevent health check failure
app.get('/', (req, res) => {
  res.sendStatus(200);
});

// when user interact with bot, Line will send a POST req to webhook URL
app.post('/webhook', function (req, res) {
  console.log('Received a message');
  res.send('HTTP POST request sent to the webhook URL!');
  // If the user sends a message to your bot, send a reply message
  if (req.body.events[0].type === 'message') {
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: 'text',
          text: req.body.events[0].message.text,
        },
      ],
    });

    // Request header
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + TOKEN,
    };

    // Options to pass into the request
    const webhookOptions = {
      hostname: 'api.line.me',
      path: '/v2/bot/message/reply',
      method: 'POST',
      headers: headers,
      body: dataString,
    };

    // Define request
    const request = https.request(webhookOptions, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    // Handle error
    request.on('error', (err) => {
      console.error(err);
    });

    // Send data
    request.write(dataString);
    request.end();
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}...`);
});

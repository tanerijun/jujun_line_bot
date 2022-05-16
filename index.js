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

// When user interact with bot, Line will send a POST req to webhook URL
app.post('/webhook', function (req, res) {
  res.send('HTTP POST request sent to the webhook URL!');
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}...`);
});

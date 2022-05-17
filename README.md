# Jujun

Jujun is a Line bot I created to make a fast reminder.

## Usage

For example: If I want to remind myself to take my clothes from the dryer in an hour, I can send a message to Jujun saying:

```
!!@2@take clothes from dryer
```

The format is:

```
!!@{time-in-hours}@{content-of-the-reminder}
```

## On Fork

1. Make a developer account on Line
2. Create a channel
3. Setup messaging API (consult the official doc)
4. Add your bot as friend in Line
5. Clone the project
6. Setup .env file:

```
  CHANNEL_ACCESS_TOKEN=
  CHANNEL_SECRET=
```

7. Make any changes you want in index.js
8. Deploy your bot
9. After deploying, go to your messaging API dashboard, and put your app url inside the "webhook" field plus a "/webhook" at the end.

```
  {your-line-bot}.herokuapp.com/webhook
```

10. Enjoy your bot!

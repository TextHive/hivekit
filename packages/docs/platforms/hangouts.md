[&larr; Hivekit Documentation](../core.md)  [&larr; Platform Index](index.md) 

# botbuilder-adapter-hangouts

Connect [Hivekit](https://www.npmjs.com/package/hivekit) or [BotBuilder](https://www.npmjs.com/package/botbuilder) to Google Hangouts.

This package contains an adapter that communicates directly with the Google Hangouts API,
and translates messages to and from a standard format used by your bot. This package can be used alongside your favorite bot development framework to build bots that work with Google Hangouts.

## Install Package

Add this package to your project using npm:

```bash
npm install --save botbuilder-adapter-hangouts
```

Import the adapter class into your code:

```javascript
const { HangoutsAdapter } = require('botbuilder-adapter-hangouts');
```

## Get Started

If you are starting a brand new project, [follow these instructions to create a customized application template.](../index.md)

## Use HangoutsAdapter in your App

HangoutsAdapter provides a translation layer for Hivekit and BotBuilder so that bot developers can connect to Google Hangouts and have access to the Google Hangouts's API.

### Hivekit Basics

When used in concert with Hivekit, developers need only pass the configured adapter to the Hivekit constructor, as seen below. Hivekit will automatically create and configure the webhook endpoints and other options necessary for communicating with Google.

Developers can then bind to Hivekit's event emitting system using `controller.on` and `controller.hears` to filter and handle incoming events from the messaging platform. [Learn more about Hivekit's core feature &rarr;](../index.md).

[A full description of the HangoutsAdapter options and example code can be found in the class reference docs.](../reference/hangouts.md#create-a-new-hangoutsadapter)

```javascript
const adapter = new HangoutsAdapter({
    token: process.env.GOOGLE_TOKEN,
    google_auth_params: {
        credentials: process.env.GOOGLE_CREDS
    }
});

const controller = new Hivekit({
    adapter,
    // ...other options
});

controller.on('message', async(bot, message) => {
    await bot.reply(message, 'I heard a message!');
});
```

### BotBuilder Basics

Alternately, developers may choose to use `HangoutsAdapter` with BotBuilder. With BotBuilder, the adapter is used more directly with a webserver, and all incoming events are handled as [Activities](https://docs.microsoft.com/en-us/javascript/api/botframework-schema/activity?view=botbuilder-ts-latest).

```javascript
const adapter = new HangoutsAdapter({
    token: process.env.GOOGLE_TOKEN,
    google_auth_params: {
        credentials: process.env.GOOGLE_CREDS
    }
});

const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.post('/api/messages', (req, res) => {
     adapter.processActivity(req, res, async(context) => {
         await context.sendActivity('I heard a message!');
     });
});
```

## Class Reference

* [HangoutsAdapter](../reference/hangouts.md#hangoutsadapter)
* [BotWorker Extensions](../reference/hangouts.md#hangoutsbotworker)

## Event List

Hivekit will emit the following events: 

| Event | Description
|--- |---
| message | a message from a user received in a shared channel
| card_clicked | a user clicked a button on a card attachment
| direct_message | a message from a user received in a private 1:1 with the bot
| bot_room_join | the bot joined a new room
| bot_dm_join | a new 1:1 with a user has been created
| bot_room_leave | the bot has been removed from a room
| bot_dm_leave | a 1:1 with a user has been closed

## Calling Google APIs

This package exposes a pre-configured Google API client for developers who want to use one of the many available API endpoints.

In Hivekit handlers, the `bot` worker object passed into all handlers will contain a `bot.api` field that contains the client, preconfigured and ready to use.

```javascript
controller.on('message', async(bot, message) {

    // get a list of the members of a room
    let members = await bot.api.spaces.members.get({name: message.channel});
    // .. do stuff

});
```

## Hivekit Extensions

In Hivekit handlers, the `bot` worker for Hangouts contains [all of the base methods](../reference/core.md#BotWorker) as well as the following platform-specific extensions:

### Use cards

Hivekit will automatically construct your outgoing messages according to Google's specifications. [Google Hangouts supports card attachments with buttons](https://developers.google.com/hangouts/chat/reference/message-formats/cards).

To use card attachments, add the `cards` field to the outgoing message object used to create the reply:

```javascript
await bot.reply(message, {
    text: 'Pick a card!',
    cards: [
        {
            // card object
        },
    ]
});
```

### Reply in a new thread

In Google Hangouts, messages are organized into threads. Hivekit provides specialized methods for cases where a bot's reply should create a new thread, or for when a bot should conduct an entire conversation in new/separate thread.

* [bot.replyInThread](../reference/hangouts.md#replyinthread)
* [bot.startConversationInThread](../reference/hangouts.md#startconversationinthread)

### Respond to `card_clicked` events

When a button in an card attachment is clicked, Google sends a special event that requires a special response.  Hivekit will emit a `card_clicked` event, which should be responded to using 
either `bot.replyWithUpdate()` or `bot.replyWithNew()`.

[See Google doc for interactive cards &rarr;](https://developers.google.com/hangouts/chat/how-tos/cards-onclick#responding_to_clicks_with_a_new_or_updated_message).

* [bot.replyWithUpdate](../reference/hangouts.md#replywithupdate)
* [bot.replyWithNew](../reference/hangouts.md#relpywithnew)

### Update and remove messages

Google Hangouts supports updating and deleting messages. Do so with the following convenience methods:

* [bot.updateMessage](../reference/hangouts.md#updatemessage)
* [bot.deleteMessage](../reference/hangouts.md#deletemessage)


## Community & Support

Join our thriving community of Hivekit developers and bot enthusiasts at large.
Over 10,000 members strong, [our open Slack group](https://community.hivekit.ai) is
_the place_ for people interested in the art and science of making bots.
Come to ask questions, share your progress, and commune with your peers!

You can also find help from members of the Hivekit team [in our dedicated Cisco Spark room](https://eurl.io/#SyNZuomKx)!

## About Hivekit

Hivekit is a part of the [Microsoft Bot Framework](https://dev.botframework.com).

Want to contribute? [Read the contributor guide](https://github.com/texthive/hivekit/blob/master/CONTRIBUTING.md)

Hivekit is released under the [MIT Open Source license](https://github.com/texthive/hivekit/blob/master/LICENSE.md)

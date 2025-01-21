# Hivekit: Building Blocks for Building Bots

<a href="https://www.npmjs.com/package/hivekit" title="View most recent version on npm"><img src="https://img.shields.io/npm/v/hivekit.svg" aria-hidden="true" alt="npm version badge"></a>
<a href="https://david-dm.org/texthive/hivekit" title="View status of dependencies"><img src="https://img.shields.io/david/texthive/hivekit.svg" alt="Dependency status badge" aria-hidden="true"></a>
<a href="https://spdx.org/licenses/MIT" title="View MIT License"><img src="https://img.shields.io/npm/l/hivekit.svg" alt="MIT License Badge" aria-hidden="true"></a>

--------------------------------------------------------------------------------

**Hivekit is an open source developer tool for building chat bots, apps and custom integrations for major messaging platforms.**

## Install Hivekit

### Remix on Glitch

Want to dive right in? [Remix one of our starter kits on Glitch](https://glitch.com/hivekit). You'll start with a fully functioning app that you can edit and run from the browser!

 [![Remix on Glitch](glitch.png)](https://glitch.com/hivekit)


### Command Line Interface

The best way to get started locally with Hivekit is by installing our command line tool, and using it to create a new Hivekit project. This will install and configure a starter kit for you!

```bash
npm install -g yo generator-hivekit
yo hivekit
```

### **Start from Scratch**

You can also add Hivekit into an existing Node application.

First, add it to your project:

```bash
npm install --save hivekit
```

Then, add Hivekit to your application code:

```javascript
let { Hivekit } = require('hivekit');

const controller = new Hivekit(MY_CONFIGURATION);

controller.hears('hello','direct_message', function(bot, message) {
    bot.reply(message,'Hello yourself!');
});
```

## Build Your Bot

Hivekit is a programming library, along with a suite of supporting tools and plugins, that provides bot builders a platform independent, language-like interface for building a chatbot or messaging app for any platform. It handles all the nitty gritty technical details, allowing you to focus on building COOL FEATURES for your bot.

The toolkit is designed to provide meaningful building blocks for creating conversational user interfaces - with functions like `hears()`, `ask()`, and `reply()` that do what they say they do.

## Hearing Messages

Most bots do their thing by listening for keywords, phrases or patterns in messages from users. Hivekit has a special event handler called `hears()` that makes it easy to configure your bot to listen for this type of trigger.

```javascript
// listen for a message containing the word "hello", and send a reply
controller.hears('hello','message',async(bot, message) => {
    // do something!
    await bot.reply(message, 'Hello human')
});
```

[Read more about hearing things &raquo;](core.md#matching-patterns-and-keywords-with-hears)

## Responding to Events

Bots can respond to non-verbal events as well, like when a new user joins a channel, a file gets uploaded, or a button gets clicked. These events are handled using an event handling pattern that should look familiar to most developers. Most events in Hivekit can be replied to like normal messages.

```javascript
// wait for a new user to join a channel, then say hi
controller.on('channel_join', async(bot, message) => {
    await bot.reply(message,'Welcome to the channel!');
});
```

[See a full list of events and more information about handling them &raquo;](core.md#receiving-messages-and-events)

## Conversation Management

Hivekit has a flexible system for handling scripted dialog and transactional conversations involving questions, branching logic, and other dynamic behaviors.

[Read about Conversations &raquo;](core.md#using-dialogs)


## Extend Hivekit with Middleware

In addition to taking direct action in response to a certain message or type of event, Hivekit can also take passive action on messages as they move through the application using middlewares. Middleware functions work by changing messages, adding new fields, firing alternate events, and modifying or overriding the behavior of Hivekit's core features.

Middleware can be used to adjust how Hivekit receives, processes, and sends messages. [Here is a list of available middleware endpoints](core.md#middlewares).

```javascript
// Log every message received
controller.middleware.receive.use(function(bot, message, next) {

    // log it
    console.log('RECEIVED: ', message);

    // modify the message
    message.logged = true;

    // continue processing the message
    next();

});

// Log every message sent
controller.middleware.send.use(function(bot, message, next) {

    // log it
    console.log('SENT: ', message);

    // modify the message
    message.logged = true;

    // continue processing the message
    next();

});
```


## What's Next?

* [Continue learning about Hivekit's core features](core.md)
* [View set-up guides for all the major platforms](provisioning/index.md)

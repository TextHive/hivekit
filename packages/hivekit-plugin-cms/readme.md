# hivekit-plugin-cms

Use and extend dialogs authored remotely using [Hivekit CMS](https://github.com/texthive/hivekit-cms#readme).

## Install Package

Add this package to your project using npm:

```bash
npm install --save hivekit-plugin-cms
```

Import the adapter class into your code:

```javascript
const { HivekitCMSHelper } = require('hivekit-plugin-cms');
```

## Use in your App

Configure the plugin with the URI of your Hivekit CMS instance and a token set in the CMS config.
These values are available from the cms admin dashboard's options tab.

Then, register the plugin and it's features with the Hivekit controller using `usePlugin()`

```javascript
let cms = new HivekitCMSHelper({
    uri: 'https://someurl.com/',
    token: 'some-token-value'
});

controller.usePlugin(cms);
```

Once registered, Hivekit will automatically load all of the available content from the Hivekit CMS api and dynamically create [HivekitConversation Dialogs](../docs/reference/core.md#hivekitconversation) for use in The bot.  [All of the plugin's methods](../docs/reference/cms.md) will be available at `controller.plugins.cms`.

To evaluate all incoming messages for triggers configured in the CMS, and automatically respond by starting the appropriate dialog, use [controller.plugins.cms.testTrigger()](../docs/reference/cms.md#testtrigger):

```javascript
// use the cms to test remote triggers
controller.on('message', async(bot, message) => {
  let triggered = await controller.plugins.cms.testTrigger(bot, message);
  
  // if a script was triggered, return false from the handler.
  // this stops hivekit from any further processing.
  if (triggered !== false) {
      return false;
  }
});
```

In most cases, calls to `testTrigger` should come at the _end_ of the bot's message evaluation process. Since Hivekit fires handlers in the order in which they are added to the controller, this call should most often be placed _after_ other trigger definintions - particularly if the CMS has been configured with a fallback script which will ALWAYS fire even if no matching trigger is found.

## Hooking code to your CMS-powered Dialogs

Since under the hood, this plugin creates [HivekitConversation Dialogs](../docs/reference/core.md#hivekitconversation), all of the same [hooks](../docs/conversations.md#hooks), [templating features](../docs/conversations.md#using-variable-tokens-and-templates-in-conversation-threads), and special actions are available. However, since the dialogs are built dynamically, special methods are necessary to _find the dialog by name_ within Hivekit's collection of dialogs before binding hooks.

* [controller.plugins.cms.before()](../docs/reference/cms.md#before)
* [controller.plugins.cms.onChange()](../docs/reference/cms.md#onchange)
* [controller.plugins.cms.after()](../docs/reference/cms.md#after)

For example, if the CMS has a script called `onboarding`, hook functions can be bound to it like so:

```javascrit
// wrap calls to the plugin in controller.ready to ensure the content has successfully loaded
controller.ready(function() {

    // fire before onboarding begins
    controller.plugins.cms.before('onboarding', async(convo, bot) => {
        convo.setVar('timestamp', new Date());
    });

    // fire after onboarding ends
    controller.plugins.cms.after('onboarding', async(results, bot) => {
        // do something like store results in the db

        // take the next step...
        await bot.say('ONBOARDING COMPLETE!');
    });
});
```

## Class Reference

* [HivekitCMSHelper](../docs/reference/cms.md)

## About Hivekit

Hivekit is a part of the [Microsoft Bot Framework](https://dev.botframework.com).

Want to contribute? [Read the contributor guide](https://github.com/texthive/hivekit/blob/master/CONTRIBUTING.md)

Hivekit is released under the [MIT Open Source license](https://github.com/texthive/hivekit/blob/master/LICENSE.md)
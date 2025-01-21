# ![Hivekit](banner.png)

**Hivekit is an open source developer tool for building chat bots, apps and custom integrations for major messaging platforms.**

This repository contains the core Hivekit library, as well as a series of plugins and extensions for connecting Hivekit to messaging and chat platforms and other tools in the bot building ecosystem.

Hivekit is part of the [Microsoft Bot Framework](https://dev.botframework.com)
and is released under the [MIT Open Source license](LICENSE.md)

# Use Hivekit

* [Install Hivekit and get started](packages/hivekit#readme)
* [Hivekit Core Docs](https://github.com/texthive/hivekit/blob/main/packages/docs/index.md)
* [Hivekit Platform Support](https://github.com/texthive/hivekit/blob/main/packages/docs/platforms/index.md)
* [Hivekit Class Reference](https://github.com/texthive/hivekit/blob/main/packages/docs/reference/index.md)

## Packages included in this repo

| Package | Description | NPM Status
|--- |--- |---
| [hivekit](packages/hivekit) | Hivekit Core library | [![NPM Badge](https://img.shields.io/npm/dw/hivekit.svg?logo=npm)](https://www.npmjs.com/package/hivekit/) 
| [botbuilder-adapter-web](packages/botbuilder-adapter-web) | A platform adapter for the web | [![NPM Badge](https://img.shields.io/npm/dw/botbuilder-adapter-web.svg?logo=npm)](https://www.npmjs.com/package/botbuilder-adapter-web) 
| [botbuilder-adapter-slack](packages/botbuilder-adapter-slack) | A platform adapter for Slack | [![NPM Badge](https://img.shields.io/npm/dw/botbuilder-adapter-slack.svg?logo=npm)](https://www.npmjs.com/package/botbuilder-adapter-slack) 
| [botbuilder-adapter-webex](packages/botbuilder-adapter-webex) | A platform adapter for Webex Teams | [![NPM Badge](https://img.shields.io/npm/dw/botbuilder-adapter-webex.svg?logo=npm)](https://www.npmjs.com/package/botbuilder-adapter-webex) 
| [botbuilder-adapter-hangouts](packages/botbuilder-adapter-hangouts) | A platform adapter for Google  | [![NPM Badge](https://img.shields.io/npm/dw/botbuilder-adapter-hangouts.svg?logo=npm)](https://www.npmjs.com/package/botbuilder-adapter-hangouts)
| [botbuilder-adapter-twilio-sms](packages/botbuilder-adapter-twilio-sms) | A platform adapter for Twilio SMS | [![NPM Badge](https://img.shields.io/npm/dw/botbuilder-adapter-twilio-sms.svg?logo=npm)](https://www.npmjs.com/package/botbuilder-adapter-twilio-sms) 
| [botbuilder-adapter-facebook](packages/botbuilder-adapter-facebook) | A platform adapter for Facebook Messenger | [![NPM Badge](https://img.shields.io/npm/dw/botbuilder-adapter-facebook.svg?logo=npm)](https://www.npmjs.com/package/botbuilder-adapter-facebook) 
| [generator-hivekit](packages/generator-hivekit) | A Yeoman generator for creating a new Hivekit project | [![NPM Badge](https://img.shields.io/npm/dw/generator-hivekit.svg?logo=npm)](https://www.npmjs.com/package/generator-hivekit) 
| [hivekit-plugin-cms](packages/hivekit-plugin-cms) | A plugin that adds support for [Hivekit CMS](https://github.com/texthive/hivekit-cms) | [![NPM Badge](https://img.shields.io/npm/dw/hivekit-plugin-cms.svg?logo=npm)](https://www.npmjs.com/package/hivekit-plugin-cms)

## Build Hivekit locally

This repo contains multiple inter-linked packages containing Hivekit Core, platform adapter packages, and some additional plugins and extensions.
To build these locally, follow the instructions below.

Install [lerna](https://github.com/lerna/lerna) and [TypeScript](https://www.typescriptlang.org/) globally:

```bash
npm install -g typescript
npm install -g lerna
```

Clone the entire Hivekit project from Github.

```bash
git clone git@github.com:texthive/hivekit.git
```

Enter the new folder and install the dependent packages:

```bash
cd hivekit
npm install
```

Use lerna to set up the local packages:

```bash
lerna bootstrap --hoist
```

Now, build all of the libraries:

```bash
lerna run build
```

To build updated versions of the class reference documents found in `packages/docs`, run:

```bash
lerna run build-docs
```

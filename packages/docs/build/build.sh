#!/bin/sh
# generate main docs
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit Core" --readme none --entryPoint hivekit ../hivekit/src/index.ts --json build/hivekit.json
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit for Slack" --readme none --entryPoint "botbuilder-adapter-slack" ../botbuilder-adapter-slack/src/index.ts --json build/slack.json
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit for Facebook" --readme none --entryPoint "botbuilder-adapter-facebook" ../botbuilder-adapter-facebook/src/index.ts --json build/facebook.json
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit for Hangouts" --readme none --entryPoint "botbuilder-adapter-hangouts" ../botbuilder-adapter-hangouts/src/index.ts --json build/hangouts.json
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit for Twilio SMS" --readme none --entryPoint "botbuilder-adapter-twilio-sms" ../botbuilder-adapter-twilio-sms/src/index.ts --json build/twilio-sms.json
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit for Webex Teams" --readme none --entryPoint "botbuilder-adapter-webex" ../botbuilder-adapter-webex/src/index.ts --json build/webex.json
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit for the Web" --readme none --entryPoint "botbuilder-adapter-web" ../botbuilder-adapter-web/src/index.ts --json build/web.json
./node_modules/.bin/typedoc --excludePrivate  --ignoreCompilerErrors --module amd --hideGenerator --name "Hivekit CMS Plugin" --readme none --entryPoint "hivekit-plugin-cms" ../hivekit-plugin-cms/src/index.ts --json build/cms.json

node build/parse.js

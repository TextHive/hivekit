const { Hivekit, HivekitConversation, HivekitTestClient, BotWorker } = require('..');
const { TestAdapter, AutoSaveStateMiddleware } = require('botbuilder');
const assert = require('assert');

class FakeBotWorker extends BotWorker {
    constructor(controller, config) {
        super(controller, config);
    }

    getUser() {
        return {
            id: 123,
            name: 'Roger'
        };
    };
}

class FakeAdapter extends TestAdapter {
  // Enables overriding the type of the BotWorker
  // (this uses a Hivekit features that allows setting a worker type)
  hivekit_worker = FakeBotWorker;
}

class CustomTestClient extends HivekitTestClient {
  constructor(channelId, bot, dialogToTest) {
    super(channelId, bot, dialogToTest);
    this._testAdapter = new FakeAdapter(this._callback, { channelId: channelId }).use(new AutoSaveStateMiddleware(this.conversationState));
  }
}

function createDialog(controller) {
    const dialog = new HivekitConversation('try_custom_worker', controller);

    dialog.ask('How you like me now?', async (response, convo, bot) => {
        const botUser = bot.getUser();
        return bot.say(`You are: ${ botUser.name }`);
    }, 'question');

    return dialog;
}

describe('Test something with custom worker', () => {
    let hivekit;
    let client;
    let testAdapter;

    it('bot can access user identity through custom bot worker', async () => {
        testAdapter = new FakeAdapter({});
        hivekit = new Hivekit({
            disable_webserver: true,
            disable_console: true,
            adapter: testAdapter
        });
        hivekit.addDialog(createDialog(hivekit));
        client = new CustomTestClient('test', hivekit, ['try_custom_worker']);

        // Test the dialog through the client
        let message = await client.sendActivity('');
        assert(message.text === 'How you like me now?');
        message = await client.sendActivity('nice!');
        assert(message.text === 'You are: Roger','Custom adapter spawning invalid bot');
    });

    afterEach(async () => {
        await hivekit.shutdown();
    });
});

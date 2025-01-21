const assert = require('assert');
const { Hivekit, TeamsBotWorker } = require('../');
const { TwilioAdapter, TwilioBotWorker } = require('../../botbuilder-adapter-twilio-sms');

describe('Hivekit', function() {
    it('should create a Hivekit controller', function() {
        assert((new Hivekit({ disable_console: true, disable_webserver: true }) instanceof Hivekit), 'Hivekit is wrong type');
    });
    it ('should spawn appropriate bot worker with a single adapter', async function() {
        const controller = new Hivekit({
            disable_webserver: true,
            adapter: new TwilioAdapter({enable_incomplete: true}),
        });
        
        const bot = await controller.spawn({});
        assert((bot instanceof TwilioBotWorker), 'Bot worker is wrong type');


    });
    it ('should spawn appropriate bot worker with a multiple adapter', async function() {

        const controller = new Hivekit({
            disable_webserver: true,
        });

        const anotherAdapter = new TwilioAdapter({enable_incomplete: true});
        
        const bot = await controller.spawn({});
        assert((bot instanceof TeamsBotWorker), 'Default Bot worker is wrong type');

        const tbot = await controller.spawn({}, anotherAdapter);
        assert((tbot instanceof TwilioBotWorker), 'Secondary Bot worker is wrong type');

    });

});

const { HivekitConversation } = require('hivekit');
module.exports = function(controller) {

    controller.on('message', async (bot, message) => {
        await bot.reply(message, { text: 'Echo: ' + message.text});
    });
}
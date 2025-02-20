const { SlackDialog } = require('botbuilder-adapter-slack');
const { HivekitConversation } = require('hivekit');

module.exports = function(controller) {

    if (controller.adapter.name === 'Slack Adapter') {
        controller.ready(async () => {
            if (process.env.MYTEAM) {
                let bot = await controller.spawn(process.env.MYTEAM);
                await bot.startConversationInChannel(process.env.MYCHAN,process.env.MYUSER);
                bot.say('I AM AWOKEN.');
            }
        });

        controller.on('reaction_added', async(bot, message) => {
            await bot.reply(message,'Cool emoji');
        });
        
        controller.on('member_joined_channel', async(bot, message) => {
            await bot.reply(message, `Welcome hume!`);
        });

        controller.on('app_mention', async(bot, message) => {
            await bot.reply(message, `Got an app_mention!`);
        })

        controller.hears('dm me', 'message', async(bot, message) => {
            await bot.startPrivateConversation(message.user);
            await bot.say(`Let's talk in private.`);
        });


        controller.on('direct_mention', async(bot, message) => {
            await bot.reply(message, `I heard a direct mention that said "${ message.text }"`);
        });

        controller.on('mention', async(bot, message) => {
            await bot.reply(message, `You mentioned me when you said "${ message.text }"`);
        });

        controller.hears('ephemeral', 'message,direct_message', async(bot, message) => {
            await bot.replyEphemeral(message,'This is an ephemeral reply sent using bot.replyEphemeral()!');
        });

        controller.hears('threaded', 'message,direct_message', async(bot, message) => {
            await bot.replyInThread(message,'This is a reply in a thread!');

            await bot.startConversationInThread(message.channel, message.user, message.incoming_message.channelData.ts);
            await bot.say('And this should also be in that thread!');
        });

        controller.hears('update', ['message','direct_message'], async(bot, message) => {
            const reply = await bot.reply(message,'This message will get updated in a few seconds.');
            setTimeout(async function() {
                await bot.updateMessage({
                    text: '[ this message was update ]',
                    ...reply
                });
            }, 3000);
        });

        controller.hears('delete', ['message','direct_message'], async(bot, message) => {
            return new Promise(async(resolve, reject) => {
                console.log('SENDING DELETABLE MESSAGE');
                const reply = await bot.reply(message,'This message will get deleted in a few seconds.');
                setTimeout(async function() {
                    await bot.deleteMessage(reply);
                    await bot.reply(message,'A message was deleted!');
                    resolve();
                }, 100);
            });
        });


        controller.hears('blocks', 'message', async(bot, message) => {

            await bot.reply(message,{
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
                            "alt_text": "alt text for image"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft."
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
                            "alt_text": "alt text for image"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder."
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
                            "alt_text": "alt text for image"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Farmhouse",
                                    "emoji": true
                                },
                                "value": "Farmhouse"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Kin Khao",
                                    "emoji": true
                                },
                                "value": "Kin Khao"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Ler Ros",
                                    "emoji": true
                                },
                                "value": "Ler Ros"
                            }
                        ]
                    }
                ]
            });

        });

        controller.on('block_actions', async (bot, message) => {
            await bot.reply(message, `Sounds like your choice is ${ message.incoming_message.channelData.actions[0].value }`)
        });

        controller.on('slash_command', async(bot, message) => {
            if (message.text === 'plain') {
                await bot.reply(message, 'This is a plain reply');
            } else if (message.text === 'public') {
                await bot.replyPublic(message, 'This is a public reply');
            } else if (message.text === 'private') {
                await bot.replyPrivate(message, 'This is a private reply');
            }

            // set http status
            bot.httpBody({text:'You can send an immediate response using bot.httpBody()'});

        });

        controller.on('interactive_message', async (bot, message) => {

            console.log('INTERACTIVE MESSAGE', message);

            switch(message.actions[0].name) {
                case 'replace':
                    await bot.replyInteractive(message,'[ A previous message was successfully replaced with this less exciting one. ]');
                    break;
                case 'dialog':
                    await bot.replyWithDialog(message, new SlackDialog('this is a dialog', '123', 'Submit', [
                        {
                            type: 'text',
                            label: 'Field 1',
                            name: 'field1',
                        },
                        {
                            type: 'text',
                            label: 'Field 2',
                            name: 'field2',
                        }
                    ]).notifyOnCancel(true).state('foo').asObject());
                    break;
                default:
                    await bot.reply(message, 'Got a button click!');
            }
        });


        controller.on('dialog_submission', async (bot, message) => {
            await bot.reply(message, 'Got a dialog submission');

            // Return an error to Slack
            bot.dialogError([
                {
                    "name": "field1",
                    "error": "there was an error in field1"
                }
            ])
        });

        controller.on('dialog_cancellation', async (bot, message) => {
            await bot.reply(message, 'Got a dialog cancellation');
        });


        const dialog = new HivekitConversation('slack_buttons', controller);

        dialog.ask({
            text: 'Click one of these ATTACHMENT BUTTONS',
            attachments: [
                {
                    title: 'This is an attachment',
                    text: 'It has some buttons',
                    callback_id: '123',
                    actions: [
                        {
                            name: 'buttona',
                            type:  'button',
                            text: 'Click this',
                            value: 'Clicked this',                                
                        },
                        {
                            name: 'buttonb',
                            type:  'button',
                            text: 'Click that',
                            value: 'Clicked that',                                
                        }
                    ]
                }
            ]
        }, [], 'button');

        dialog.say('You clicked {{vars.button}}');

        dialog.ask({
            text: 'Click one of these BLOCK BUTTONS',
            blocks: [
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "BLOCK A",
                                "emoji": true
                            },
                            "value": "A"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "BLOCK B",
                                "emoji": true
                            },
                            "value": "B"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "BLOCK C",
                                "emoji": true
                            },
                            "value": "C"
                        }
                    ]
                }
            ]
        }, [], 'block');

        dialog.say('You clicked {{vars.block}}');
        controller.addDialog(dialog);

        controller.hears('buttons', 'message,direct_message,direct_mention', async(bot, message) => {
            await bot.beginDialog('slack_buttons');
        });

    }

}
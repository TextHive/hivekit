/**
 * @module hivekit-plugin-cms
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Hivekit, HivekitDialogWrapper, HivekitMessage, BotWorker, HivekitConversation } from 'hivekit';
import * as request from 'request';
import * as Debug from 'debug';
import * as url from 'url';

const debug = Debug('hivekit:cms');

/**
 * A plugin for Hivekit that provides access to an instance of [Hivekit CMS](https://github.com/texthive/hivekit-cms), including the ability to load script content into a DialogSet
 * and bind before, after and onChange handlers to those dynamically imported dialogs by name.
 *
 * ```javascript
 * controller.use(new HivekitCMSHelper({
 *      uri: process.env.CMS_URI,
 *      token: process.env.CMS_TOKEN
 * }));
 *
 * // use the cms to test remote triggers
 * controller.on('message', async(bot, message) => {
 *   await controller.plugins.cms.testTrigger(bot, message);
 * });
 * ```
 */
export class HivekitCMSHelper {
    private _config: any;
    private _controller: Hivekit;

    /**
     * Hivekit Plugin name
     */
    public name = 'Hivekit CMS';

    public constructor(config: CMSOptions) {
        this._config = config;
        if (config.controller) {
            this._controller = this._config.controller;
        }

        // for backwards compat, handle these alternate locations
        if (this._config.cms_uri && !this._config.uri) {
            this._config.uri = this._config.cms_uri;
        }
        if (this._config.cms_token && !this._config.token) {
            this._config.token = this._config.cms_token;
        }

        if (!this._config.uri) {
            throw new Error('Specify the root url of your Hivekit CMS instance as `uri`');
        }
        if (!this._config.token) {
            throw new Error('Specify a token that matches one configured in your Hivekit CMS instance as `token`');
        }
    }

    /**
     * Hivekit plugin init function
     * Autoloads all scripts into the controller's main dialogSet.
     * @param hivekit A Hivekit controller object
     */
    public init(hivekit): void {
        this._controller = hivekit;
        this._controller.addDep('cms');

        // Extend the controller object with controller.plugins.cms
        hivekit.addPluginExtension('cms', this);

        // pre-load all the scripts via the CMS api
        this.loadAllScripts(this._controller).then(() => {
            debug('Dialogs loaded from Hivekit CMS');
            this._controller.completeDep('cms');
        }).catch((err) => {
            console.error(`****************************************************************\n${ err }\n****************************************************************`);
        });
    }

    private async apiRequest(uri: string, params: {[key: string]: any} = {}, method = 'GET'): Promise<any> {
        const req = {
            uri: new url.URL(uri + '?access_token=' + this._config.token, this._config.uri),
            headers: {
                'content-type': 'application/json'
            },
            method: method,
            form: params
        };

        debug('Make request to Hivekit CMS: ', req);

        return new Promise((resolve, reject) => {
            request(req, function(err, res, body) {
                if (err) {
                    debug('Error in Hivekit CMS api: ', err);
                    return reject(err);
                } else {
                    debug('Raw results from Hivekit CMS: ', body);
                    if (body === 'Invalid access token') {
                        return reject(new Error('Failed to load Hivekit CMS content: Invalid access token provided.\nMake sure the token passed into the CMS plugin matches the token set in the CMS .env file.'));
                    }
                    let json = null;
                    try {
                        json = JSON.parse(body);
                    } catch (err) {
                        debug('Error parsing JSON from Hivekit CMS api: ', err);
                        return reject(err);
                    }

                    if (!json || json == null) {
                        reject(new Error('Hivekit CMS API response was empty or invalid JSON'));
                    } else if (json.error) {
                        if (res.statusCode === 401) {
                            console.error(json.error);
                        }
                        reject(json.error);
                    } else {
                        resolve(json);
                    }
                }
            });
        });
    }

    private async getScripts(): Promise<any[]> {
        return this.apiRequest('/api/v1/commands/list');
    }

    private async evaluateTrigger(text: string): Promise<any> {
        return this.apiRequest('/api/v1/commands/triggers', {
            triggers: text
        }, 'POST');
    }

    /**
     * Load all script content from the configured CMS instance into a DialogSet and prepare them to be used.
     * @param dialogSet A DialogSet into which the dialogs should be loaded.  In most cases, this is `controller.dialogSet`, allowing Hivekit to access these dialogs through `bot.beginDialog()`.
     */
    public async loadAllScripts(hivekit: Hivekit): Promise<void> {
        const scripts = await this.getScripts();

        scripts.forEach((script) => {
            // map threads from array to object
            const threads = {};
            script.script.forEach((thread) => {
                threads[thread.topic] = thread.script.map(this.mapFields);
            });

            const d = new HivekitConversation(script.command, this._controller);
            d.script = threads;
            hivekit.addDialog(d);
        });
    }

    /**
     * Map some less-than-ideal legacy fields to better places
     */
    private mapFields(line): void {
        // Create the channelData field where any channel-specific stuff goes
        if (!line.channelData) {
            line.channelData = {};
        }

        // TODO: Port over all the other mappings

        // move slack attachments
        if (line.attachments) {
            line.channelData.attachments = line.attachments;
        }

        // we might have a facebook attachment in fb_attachments
        if (line.fb_attachment) {
            const attachment = line.fb_attachment;
            if (attachment.template_type) {
                if (attachment.template_type === 'button') {
                    attachment.text = line.text[0];
                }
                line.channelData.attachment = {
                    type: 'template',
                    payload: attachment
                };
            } else if (attachment.type) {
                line.channelData.attachment = attachment;
            }

            // blank text, not allowed with attachment
            line.text = null;

            // remove blank button array if specified
            if (line.channelData.attachment.payload.elements) {
                for (let e = 0; e < line.channelData.attachment.payload.elements.length; e++) {
                    if (!line.channelData.attachment.payload.elements[e].buttons || !line.channelData.attachment.payload.elements[e].buttons.length) {
                        delete (line.channelData.attachment.payload.elements[e].buttons);
                    }
                }
            }

            delete (line.fb_attachment);
        }

        // Copy quick replies to channelData.
        // This gives support for both "native" quick replies AND facebook quick replies
        if (line.quick_replies) {
            line.channelData.quick_replies = line.quick_replies;
        }

        // handle teams attachments
        if (line.platforms && line.platforms.teams) {
            if (line.platforms.teams.attachments) {
                line.attachments = line.platforms.teams.attachments.map((a) => {
                    a.content = { ...a };
                    a.contentType = 'application/vnd.microsoft.card.' + a.type;
                    return a;
                });
            }
            delete (line.platforms.teams);
        }

        // handle additional custom fields defined in Hivekit-CMS
        if (line.meta) {
            for (let a = 0; a < line.meta.length; a++) {
                line.channelData[line.meta[a].key] = line.meta[a].value;
            }
            delete (line.meta);
        }

        return line;
    }

    /**
     * Uses the Hivekit CMS trigger API to test an incoming message against a list of predefined triggers.
     * If a trigger is matched, the appropriate dialog will begin immediately.
     * @param bot The current bot worker instance
     * @param message An incoming message to be interpretted
     * @returns Returns false if a dialog is NOT triggered, otherwise returns void.
     */
    public async testTrigger(bot: BotWorker, message: Partial<HivekitMessage>): Promise<any> {
        const command = await this.evaluateTrigger(message.text);
        if (command.command) {
            return await bot.beginDialog(command.command);
        }
        return false;
    }

    /**
     * Bind a handler function that will fire before a given script and thread begin.
     * Provides a way to use HivekitConversation.before() on dialogs loaded dynamically via the CMS api instead of being created in code.
     *
     * ```javascript
     * controller.cms.before('my_script','my_thread', async(convo, bot) => {
     *
     *  // do stuff
     *  console.log('starting my_thread as part of my_script');
     *  // other stuff including convo.setVar convo.gotoThread
     *
     * });
     * ```
     *
     * @param script_name The name of the script to bind to
     * @param thread_name The name of a thread within the script to bind to
     * @param handler A handler function in the form async(convo, bot) => {}
     */
    public before(script_name: string, thread_name: string, handler: (convo: HivekitDialogWrapper, bot: BotWorker) => Promise<void>): void {
        const dialog = this._controller.dialogSet.find(script_name) as HivekitConversation;
        if (dialog) {
            dialog.before(thread_name, handler);
        } else {
            throw new Error('Could not find dialog: ' + script_name);
        }
    }

    /**
     * Bind a handler function that will fire when a given variable is set within a a given script.
     * Provides a way to use HivekitConversation.onChange() on dialogs loaded dynamically via the CMS api instead of being created in code.
     *
     * ```javascript
     * controller.plugins.cms.onChange('my_script','my_variable', async(new_value, convo, bot) => {
    *
    * console.log('A new value got set for my_variable inside my_script: ', new_value);
    *
    * });
    * ```
    *
    * @param script_name The name of the script to bind to
    * @param variable_name The name of a variable within the script to bind to
    * @param handler A handler function in the form async(value, convo, bot) => {}
    */
    public onChange(script_name: string, variable_name: string, handler: (value: any, convo: HivekitDialogWrapper, bot: BotWorker) => Promise<void>): void {
        const dialog = this._controller.dialogSet.find(script_name) as HivekitConversation;
        if (dialog) {
            dialog.onChange(variable_name, handler);
        } else {
            throw new Error('Could not find dialog: ' + script_name);
        }
    }

    /**
    * Bind a handler function that will fire after a given dialog ends.
    * Provides a way to use HivekitConversation.after() on dialogs loaded dynamically via the CMS api instead of being created in code.
    *
    * ```javascript
    * controller.plugins.cms.after('my_script', async(results, bot) => {
    *
    * console.log('my_script just ended! here are the results', results);
    *
    * });
    * ```
    *
    * @param script_name The name of the script to bind to
    * @param handler A handler function in the form async(results, bot) => {}
    */
    public after(script_name: string, handler: (results: any, bot: BotWorker) => Promise<void>): void {
        const dialog = this._controller.dialogSet.find(script_name) as HivekitConversation;
        if (dialog) {
            dialog.after(handler);
        } else {
            throw new Error('Could not find dialog: ' + script_name);
        }
    }
}

export interface CMSOptions {
    uri: string;
    token: string;
    controller?: Hivekit;
}

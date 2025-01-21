module.exports = function(hivekit) {

    return {
        name: 'Verbose Console Logger',
        init: function(hivekit) {
            // Log requests to console using an Express middleware
            if (hivekit.webserver) {
                hivekit.webserver.use(function(req, res, next) {
                    console.log('> ', req.url);
                    next();
                });
            }

        },
        middlewares: {
            receive: [
                function(bot, message, next) {
                    console.log(`RCVD > ${ message.type } >`, message.text);
                    next();
                }
            ],
            send: [
                function(bot, message, next) {
                    console.log('SENT > ', message.text);
                    next();
                }
            ]
        }
    }
}
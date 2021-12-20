const {
    RegisterNotificationsController,
} = require('../../controllers/registerNotifications.controller');
const logger = require('../../../../config/logger');
const { env } = require('../../../../config/vars');

module.exports = async (agenda) => {
    await agenda
        .define('Send Register Notifications', 
        { priority: 'high', concurrency: 10 },
        async (job, done) => {
            try {
                const notificationsController = new RegisterNotificationsController();
                
                await notificationsController.notify();
                done();
            } catch (error) {
                logger.info(`[${error.message}]\n${error}`);
            }
        },
    );
    try {
        await agenda
            .every(
                '1 day',
                'Send Register Notifications', 
                {}, 
                {
                    skipImmediate: true,
                    timezone: 'GMT',
                },
            );
        await agenda.start();
    } catch (error) {
        logger.info(`[${error.message}]\n${error}`);
    }
};
const logger = require('../../../../config/logger');
const { env } = require('../../../../config/vars');
const {
  WeeklyPostNotificationController,
} = require('../../controllers/weeklyPostNotificationController');

module.exports = async (agenda) => {
  await agenda
    .define(
      'Send Weekly Brief Email Notification',
      { priority: 'high', concurrency: 10 },
      async (job, done) => {
        try {
          const notificationController = new WeeklyPostNotificationController();

          await (await notificationController.loadUsers()).notify();
          done();
        } catch (error) {
          logger.info(`[${error.message}]\n${error}`);
        }
      },
    );

  try {
    // segundas-feiras de manhã (GMT +0, 7AM)
      await agenda
      .every(
        '0 07 * * 1',
        'Send Weekly Brief Email Notification',
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

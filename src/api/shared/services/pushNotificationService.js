const vars = require('../../../config/vars');
const azure = require('azure-sb');

const notificationHubService = azure.createNotificationHubService(
  vars.AZURE_NOTIFICATION_HUB_NAME,
  vars.AZURE_NOTIFICATION_CONNECTION_STRING,
);

exports.createOrUpdateInstallation = async (installation, options, callback) => {
  await notificationHubService.createOrUpdateInstallation(installation, options, callback);
};

exports.sendNotification = async (notification) => {
  try {
    const payloadFcm = {
      data: {
        title: notification.title,
        message: notification.description,
        link: notification.link,
      },
    };

    const payloadAps = {
      aps: {
        alert: {
          title: notification.title,
          body: notification.description,
        },
        link: notification.link,
      },
    };

    // commented to prevent apns error
    // notificationHubService.apns.send(null, payloadAps, (error) => {
    //   if (error) {
    //     console.log(error);
    //   }
    // });

    notificationHubService.gcm.send(null, payloadFcm, (error) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

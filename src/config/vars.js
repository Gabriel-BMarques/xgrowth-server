/* eslint-disable max-len */
const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});
// console.log(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri:
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URI_DEV
        : process.env.NODE_ENV === 'demo'
          ? `mongodb+srv://${process.env.DEMO_DB_USER}:${process.env.DEMO_DB_PASS}@${process.env.DEMO_DB_HOST}/${process.env.DEMO_DB_NAME}`
          : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  senderEmail: process.env.SENDER_EMAIL,
  contactEmail: process.env.CONTACT_EMAIL,
  SENDGRID_API_KEY_ID: process.env.SENDGRID_API_KEY_ID,
  SENDGRID_API_KEY_SECRET: process.env.SENDGRID_API_KEY_SECRET,
  CLIENT_BASE_URL:
    process.env.NODE_ENV === 'development'
      ? process.env.CLIENT_BASE_URL_DEV
      : process.env.NODE_ENV === 'demo'
        ? process.env.CLIENT_BASE_URL_DEMO
        : process.env.CLIENT_BASE_URL_PROD,
  AZURE_NOTIFICATION_HUB_NAME: process.env.AZURE_NOTIFICATION_HUB_NAME,
  AZURE_NOTIFICATION_CONNECTION_STRING: process.env.AZURE_NOTIFICATION_CONNECTION_STRING,
  API_KEY:
    process.env.NODE_ENV === 'development'
      ? process.env.LOCAL_API_KEY
      : process.env.NODE_ENV === 'demo'
        ? process.env.DEMO_API_KEY
        : process.env.PROD_API_KEY,
};

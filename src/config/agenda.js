/* eslint-disable global-require */
const Agenda = require("agenda");
const {
  WeeklyPostNotificationController,
} = require("../api/shared/controllers/weeklyPostNotificationController");
const {
  mongo: { uri: dbConnection },
} = require("../config/vars");
const logger = require("./logger");

const configureMongoDBObj = {
  db: {
    address: dbConnection,
    collection: "agendaJobs",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

// @ts-ignore
const agenda = new Agenda(configureMongoDBObj);

// eslint-disable-next-line no-return-await
agenda.on("ready", async () => {
  try {
    // auto start all scheduled jobs
    require("../api/shared/jobs/agenda");
    // await agenda.start();
    logger.info("[Agenda started succesfully]");
  } catch (err) {
    logger.info(`[Agenda failed to start]: ${err}\n${err.message}`);
  }
});
agenda.on("error", async (err) =>
  logger.error(`[Agenda failed to start]: ${err}\n${err.message}`)
);

module.exports = agenda;

/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const agenda = require('../../../config/agenda');

// list the different jobs availale throughout your app
// if you are adding the job types dynamically and saving them in the database you will get it here
const jobTypes = ['weekly-post-notification', 'register-notifications'];

// loop through the job_list folder and pass in the agenda instance
jobTypes.forEach((type) => {
  // the type name should match the file name in the jobs_list folder
  require(`./jobs_list/${type}`)(agenda);
});

const graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = agenda;

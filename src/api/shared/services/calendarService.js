/* eslint-disable camelcase */
// const vars = require('../../../config/vars');
const ics = require('ics');
// const sgMail = require('@sendgrid/mail');
const { writeFileSync, readFileSync } = require('fs');

exports.getIcsAttachment = (webinar) => {
  const eventDate = new Date(webinar.eventDate);
  const eventEndDate = new Date(webinar.eventEndDate);
  const year = eventDate.getUTCFullYear();
  const day = eventDate.getUTCDate();
  const month = eventDate.getUTCMonth() + 1;
  const hour = eventDate.getUTCHours();
  const mins = eventDate.getUTCMinutes();
  const eventDurationHours = Math.floor((Math.abs(eventEndDate - eventDate) / 1000) / 3600) % 24;
  const eventDurationMinutes = Math.floor((Math.abs(eventEndDate - eventDate) / 1000) / 60) % 60;
  const event = {
    start: [year, month, day, hour, mins],
    duration: { hours: eventDurationHours, minutes: eventDurationMinutes },
    title: `${webinar.title}`,
    description: `${webinar.description}`,
    location: 'Internet',
    // url: `${webinar.meetingLink}`,
    status: 'TENTATIVE',
    busyStatus: 'BUSY',
    organizer: { name: 'Admin', email: 'support@growinco.com' },
    // attendees: [...attendees],
    method: 'REQUEST',
  };
  let attachments = [];
  ics.createEvent(event, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }

    writeFileSync(`${__dirname}/event.ics`, value);

    const pathToAttachment = `${__dirname}/event.ics`;
    const attachment = readFileSync(pathToAttachment).toString('base64');

    attachments = [
      {
        content: attachment,
        filename: 'event.ics',
        name: 'event.ics',
        type: 'text/calendar; method=REQUEST',
        disposition: 'attachment',
      },
    ];
  });
  return attachments;
};

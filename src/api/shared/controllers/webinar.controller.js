const httpStatus = require("http-status");
const { omit } = require("lodash");
const Webinar = require("../models/webinar.model");
const User = require("../../user/model/user.model");
const WebinarInvitation = require("../models/webinarInvitation.model");
const calendarService = require("../services/calendarService");
const _ = require("lodash");
const mailService = require("../services/mailService");
const Notification = require("../../notification/model/notification.model");
const NotificationUser = require("../../notification-user/model/notificationUser.model");
const Company = require("../../company-profile/model/companyProfile.model");
const userService = require("../../user/services/userService");
const webinarService = require("../services/webinar.service");
const mailLinkPrefix =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4200/#/"
    : process.env.NODE_ENV === "demo"
    ? "https://xgrowth-test.azurewebsites.net/#/"
    : "https://xgrowth.growinco.com/#/";

/**
 * Create Webinar
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Webinar(req.body);
    entity.createdBy = req.user._id;

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Publish Webinar
 * @public
 */
exports.publishWebinar = async (req, res, next) => {
  try {
    const entity = new Webinar(req.body);
    entity.updatedBy = req.user._id;
    entity.isPublished = true;

    const newEntity = omit(entity.toObject(), "_id", "__v");
    const oldEntity = await Webinar.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    let savedEntity = await Webinar.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), "userId");

    const mailData = {
      createdBy: req.user.email,
      webinarTitle: savedEntity.title,
    };

    mailService.sendWebinarCreatedMessage(mailData);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Create WebinarInvitations
 * @public
 */
exports.createInvitations = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id);

    await WebinarInvitation.deleteMany({ webinarId: webinar._id });

    const userQuery = {
      organization:
        webinar.targetOrganization && webinar.targetOrganization.length
          ? webinar.targetOrganization
          : undefined,
      company:
        webinar.targetCompanies && webinar.targetCompanies.length
          ? webinar.targetCompanies
          : undefined,
      department:
        webinar.targetDepartments && webinar.targetDepartments.length
          ? webinar.targetDepartments
          : undefined,
      country:
        webinar.targetCountries && webinar.targetCountries.length
          ? webinar.targetCountries
          : undefined,
    };

    Object.keys(userQuery).forEach((key) =>
      userQuery[key] === undefined ? delete userQuery[key] : {}
    );

    if (!userQuery.company) {
      const relatedCompaniesQuery = await userService.getUserRelatedCompaniesQuery(req);
      const relatedCompanies = await Company.find(relatedCompaniesQuery);
      userQuery.company = relatedCompanies.map((company) =>
        company._id.toString()
      );
    }

    const users = await User.find(userQuery);

    const invitations = users.map(
      (user) =>
        new WebinarInvitation({
          invitedUserId: user._id,
          webinarId: webinar._id,
          status: "pending approval",
        })
    );

    const savedInvitations = await WebinarInvitation.insertMany(invitations);

    res.status(httpStatus.CREATED);
    res.json(savedInvitations);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Webinar
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Webinar.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Webinar populated by id
 * @public
 */
exports.getPopulated = async (req, res, next) => {
  try {
    const entity = await Webinar.findById(req.params.id)
      .populate("targetOrganization")
      .populate("targetCompanies")
      .populate("targetCountries")
      .populate({
        path: "createdBy",
        model: "User",
        select: { company: 1, firstName: 1, familyName: 1 },
        populate: {
          path: "company",
          model: "CompanyProfile",
          select: { organization: 1 },
          populate: {
            path: "organization",
            model: "Organization",
            select: { name: 1 },
          },
        },
      });

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Approve webinar and send its invitations
 * @public
 */
exports.approve = async (req, res, next) => {
  try {
    // put invitations on invited users calendar (TO-DO)
    const webinar = await Webinar.findById(req.body._id);

    if (!webinar) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    await webinar.update({ reviewStatus: "approved" });

    await WebinarInvitation.updateMany(
      { webinarId: webinar._id },
      { $set: { status: "invited" } },
      { upsert: true }
    );

    const invitedUsers = (
      await WebinarInvitation.find({
        webinarId: webinar._id,
      }).populate("invitedUserId")
    ).map((invitation) => invitation.invitedUserId);

    try {
      await Promise.all([
        sendInviteNotifications(req, webinar, invitedUsers),
        sendApprovalNotification(req, webinar),
      ]);
    } catch (err) {
      console.log(err);
    }

    res.status(httpStatus.OK);
    res.json(webinar);
  } catch (error) {
    next(error);
  }
};

sendApprovalNotification = async (req, webinar) => {
  const notification = {};
  notification.createdBy = req.user._id;
  notification.title = "Your webinar has been approved";
  notification.description = "Now it can be viewed by its target audience!";
  notification.link = "webinars";
  const url =
    webinar.uploadedFiles && webinar.uploadedFiles.length
      ? webinar.uploadedFiles[0].url
      : "";
  notification.receiverId = webinar.createdBy;

  const creator = await User.findById(webinar.createdBy);

  mailData = {
    body: {
      userEmail: creator.email,
      firstName: creator.firstName,
      imageURL: url,
      webinarDescription: webinar.description,
      title: webinar.title,
      link: `${mailLinkPrefix}${notification.link}`,
    },
  };
  const userNotification = {
    userId: user._id,
    sentOn: new Date(),
    title: notification.title,
    description: notification.description,
    link: notification.link,
    userId: notification.receiverId,
    webinarId: webinar._id,
  };

  try {
    await Promise.all([
      mailService.sendWebinarApproval(mailData),
      Notification.create(notification),
      NotificationUser.create(userNotification),
    ]);
  } catch (error) {
    console.log(error);
  }
};

const sendInviteNotifications = async (req, webinar, invitedUsers) => {
  const notification = {};
  const notifications = [];
  notification.title = "You've been invited to a webinar!";
  notification.description = `Created by ${webinar.createdBy}`;
  notification.link = "webinars?tab=invitations";
  const url =
    webinar.uploadedFiles && webinar.uploadedFiles.length
      ? webinar.uploadedFiles[0].url
      : "";
  let index = 0;

  const attachments = calendarService.getIcsAttachment(webinar);
  const recipientsEmails = invitedUsers.map(user => user.email);
  const mailData = {
    body: {
      userEmails: recipientsEmails,
      imageURL: url,
      webinarDescription: webinar.description,
      title: webinar.title,
      meetingLink: webinar.meetingLink,
      link: `${mailLinkPrefix}${notification.link}`,
      attachments,
    },
  };
  mailService.sendWebinarInvitations(mailData);

  while (index < invitedUsers.length) {
    notification.receiverId = invitedUsers[index]._id;
    notifications.push(_.cloneDeep(notification));
    index += 1;
  }

  index = 0;
  const userNotifications = [];
  while (index < notifications.length) {
    const notification = notifications[index];
    const entity = new Notification(notification);
    entity.createdBy = req.user._id;
    const saved = await entity.save();

    const userNotification = {
      userId: user._id,
      sentOn: new Date(),
      title: notification.title,
      description: notification.description,
      link: notification.link,
      userId: notification.receiverId,
      webinarId: webinar._id,
    };
    userNotifications.push(userNotification);
    index += 1;
  }
  try {
    await NotificationUser.insertMany(userNotifications);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Deny webinar and send its invitations
 * @public
 */
exports.deny = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.body._id);

    if (!webinar) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    await webinar.update({
      reviewStatus: "denied",
      denialReason: req.body.denialReason,
    });

    await WebinarInvitation.updateMany(
      { webinarId: webinar._id },
      { $set: { status: "pending approval" } },
      { upsert: true }
    );

    try {
      await sendDenialNotification(req, webinar, req.body.denialReason);
    } catch (error) {
      console.log(error);
    }

    res.status(httpStatus.OK);
    res.json(webinar);
  } catch (error) {
    next(error);
  }
};

sendDenialNotification = async (req, webinar, denialReason) => {
  const notification = {};
  notification.createdBy = req.user._id;
  notification.title = "Your webinar has been denied :(";
  notification.description = denialReason;
  notification.link = "webinars";
  const url =
    webinar.uploadedFiles && webinar.uploadedFiles.length
      ? webinar.uploadedFiles[0].url
      : "";
  notification.receiverId = webinar.createdBy;
  const creator = await User.findById(webinar.createdBy);
  mailData = {
    body: {
      userEmail: creator.email,
      firstName: creator.firstName,
      imageURL: url,
      denialReason,
      webinarDescription: webinar.description,
      title: webinar.title,
      link: `${mailLinkPrefix}${notification.link}`,
    },
  };
  const userNotification = {
    userId: user._id,
    sentOn: new Date(),
    title: notification.title,
    description: notification.description,
    link: notification.link,
    userId: notification.receiverId,
    webinarId: webinar._id,
  };

  try {
    await Promise.all([
      mailService.sendWebinarDenial(mailData),
      Notification.create(notification),
      NotificationUser.create(userNotification),
    ]);
  } catch (error) {
    console.log(error);
  }
};

/**
 * List Webinar
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    const entities = await Webinar.find(query).populate({
      path: "createdBy",
      model: "User",
      populate: {
        path: "company",
        model: "CompanyProfile",
        select: { organization: 1 },
        populate: {
          path: "organization",
          model: "Organization",
          select: { name: 1 },
        },
      },
    }).sort({ createdAt: -1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing Webinar
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Webinar(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), "_id", "__v");
    const oldEntity = await Webinar.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    let savedEntity = await Webinar.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), "userId");

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Webinar
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Webinar.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};

exports.listByOrganization = async (req, res, next) => {
  try {
    let entities = await Webinar.aggregate(webinarService.listByOrganizationAggregation(req));
    console.log('WEBINARS AQUI', entities);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
}

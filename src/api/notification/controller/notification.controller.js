const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Notification = require('../model/notification.model');
const NotificationUser = require('../../notification-user/model/notificationUser.model');
const User = require('../../user/model/user.model');
const pushNotificationService = require('../../shared/services/pushNotificationService');
const mongoose = require('mongoose');
const mailService = require('../../shared/services/mailService');
const notificationService = require('../../shared/services/notificationService');

/**
 * Create Notification
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    let notifications = (await notificationService.getNotifications(req.body, req.user)).map((not) => {
      let entity = new Notification(not);
      entity.createdBy = req.user._id;
      return entity;
    });

    let userNotifications = notifications.map((notification) => {
      let userNotification = new NotificationUser({
        userId: req.user._id,
        sentOn: new Date(), 
        title: notification.title,
        description: notification.description,
        link: notification.link,
        userId: notification.receiverId
      });
      if (notification.briefId) userNotification.briefId = notification.briefId
      else if (notification.postId) userNotification.postId = notification.postId;
      return userNotification;
    });

    let savedNotifications = await Notification.insertMany(notifications);
    NotificationUser.insertMany(userNotifications);
    
    for (let saved of savedNotifications) {
      pushNotificationService.sendNotification(saved);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get Notification
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let entity = await Notification.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entity = omit(entity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Notification By userID
 * @public
 */
exports.listByReceiverId = async (req, res, next) => {
  try {
    let entities = await Notification.find({ receiverId: mongoose.Types.ObjectId(req.params.id) });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['userId', 'createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Notifications
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    let entities = await Notification.find(query).sort({ createdAt: -1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['userId', 'createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a existing Notification
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Notification(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Notification.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (req.user._id.toString() !== oldEntity.createdBy.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    let savedEntity = await Notification.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    const users = await User.find({});

    const userNotifications = [];
    users.map((user) => {
      const userNotification = {
        userId: user._id,
        sentOn: new Date(),
        ...newEntity,
      };

      userNotifications.push(userNotification);
    });

    NotificationUser.create(userNotifications).then(
      (res) => {},
      (err) => {
        console.log('Error to create notification users.', err);
      }
    );

    pushNotificationService.sendNotification(savedEntity);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Notification
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Notification.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    if (req.user._id.toString() !== entity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};

const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const NotificationUser = require('../model/notificationUser.model');
const mongoose = require('mongoose');
const _ = require('lodash');

function isReaded(oldEntity, newEntity) {
  return !oldEntity.read && newEntity.read;
}

/**
 * Create NotificationUser
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new NotificationUser(req.body);
    entity.createdBy = req.user._id;
    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Read all NotificationUser
 * @public
 */
exports.readAll = async (req, res, next) => {
  try {
    const saved = await NotificationUser.updateMany(
      { userId: req.user._id },
      {
        $set: {
          read: true,
          readOn: Date.now(),
        },
      }
    );

    res.status(httpStatus.NO_CONTENT);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Hide all NotificationUser
 * @public
 */
exports.hideAll = async (req, res, next) => {
  try {
    const saved = await NotificationUser.updateMany(
      { userId: req.user._id },
      {
        $set: { display: false, read: true },
      }
    );

    res.status(httpStatus.NO_CONTENT);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Display all NotificationUser
 * @public
 */
exports.displayAllNotifications = async (req, res, next) => {
  try {
    const saved = await NotificationUser.updateMany(
      {},
      {
        $set: { display: true },
      }
    );

    res.status(httpStatus.NO_CONTENT);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Count NotificationUser
 * @public
 */
exports.countNotifications = async (req, res, next) => {
  try {
    let counter = await NotificationUser.countDocuments({
      userId: { $in: req.user._id },
      read: { $in: false },
      display: true,
    });

    if (!counter) {
      res.status(httpStatus.OK);
      res.json(null);
      // return next();
    }

    res.status(httpStatus.OK);
    res.json(counter);
  } catch (error) {
    // return next();
  }
};

/**
 * Get NotificationUser
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let entity = await NotificationUser.findById(req.params.id);

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
 * List NotificationUser By userID
 * @public
 */
exports.listByUserId = async (req, res, next) => {
  try {
    let entities = await NotificationUser.find({
      userId: { $in: req.user._id },
      display: true,
    })
      .populate('briefId')
      .populate('organizationId')
      .populate('postId')
      .populate('webinarId')
      .sort({ createdAt: -1 });

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
 * List NotificationUser
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    let entities = await NotificationUser.find({
      $in: { userId: req.user._id },
      $in: query,
    }).sort({ createdAt: -1 });

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
 * Update a existing NotificationUser
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new NotificationUser(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await NotificationUser.findById(entity._id);

    if (isReaded(oldEntity, newEntity)) {
      newEntity.readOn = Date.now();
    }

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (req.user._id.toString() !== oldEntity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    let savedEntity = await NotificationUser.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete NotificationUser
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await NotificationUser.findById(req.params.id);

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

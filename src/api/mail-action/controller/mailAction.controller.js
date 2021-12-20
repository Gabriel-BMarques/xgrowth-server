const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const MailAction = require ('../model/mailAction.model');
const User = require('../../user/model/user.model');
const mongoose = require('mongoose');

/**
 * Create Notification
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new MailAction();
    entity.type = req.type;
    entity.receiverId = req.receiverId;
    const saved = await entity.save();
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
    let entity = await MailAction.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

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
    let entities = await MailAction.find({ receiverId: mongoose.Types.ObjectId(req.params.id) });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
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

    let entities = await MailAction.find(query).sort({ createdAt: -1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete MailAction
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await MailAction.findById(req.params.id);

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

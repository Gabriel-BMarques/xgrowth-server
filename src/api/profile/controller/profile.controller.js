const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const User = require('../../user/model/user.model');
const ClientProfile = require('../models/profile.model');

/**
 * Create Client Profile
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new ClientProfile(req.body);
    entity.userId = req.user._id;
    const saved = await entity.save();

    await User.updateOne({ _id: entity.userId }, { $set: { profileComplete: true } });

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Client Profile
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let entity = await ClientProfile.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (req.user._id.toString() !== entity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
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
 * List Client Profile
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await ClientProfile.find(query);

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
 * List Client Profile
 * @public
 */
exports.listByCurrentUserDomain = async (req, res, next) => {
  try {
    const regex = `@${req.user.email.split('@')[1]}`;
    const query = { email: { $regex: new RegExp(regex) } };
    const users = await User.find(query);

    if (!users || users.length === 0) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    const userIds = [];

    for (let index = 0; index < users.length; index += 1) {
      const element = users[index];
      userIds.push(element._id);
    }

    let entities = await ClientProfile.find({ userId: { $in: userIds } });

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
 * Get Client Profile By userID
 * @public
 */
exports.getByUserId = async (req, res, next) => {
  try {
    let entity = await ClientProfile.findOne({ userId: req.user._id });

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (req.user._id.toString() !== entity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    entity = omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a existing Client Profile
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new ClientProfile(req.body);
    const newEntity = omit(entity.toObject(), 'userId', '_id', '__v');
    const oldEntity = await ClientProfile.findById(entity._id);
    const editorEntity = await ClientProfile.findOne({ userId: req.user._id });

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (editorEntity.companyAdmin !== true &&
    req.user._id.toString() !== oldEntity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    let savedEntity = await ClientProfile.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

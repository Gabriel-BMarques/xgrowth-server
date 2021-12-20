const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Request = require('../model/request.model');

/**
 * Create Request
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Request(req.body);
    entity.userId = req.user._id;
    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Request
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let entity = await Request.findById(req.params.id);

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
 * List Request By userID
 * @public
 */
exports.listByUserId = async (req, res, next) => {
  try {
    let entities = await Request.find({ userId: req.user._id });

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
 * List Requests
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    let entities = await Request.find(query);

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
 * Update a existing Request
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Request(req.body);
    entity.userId = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Request.findById(entity._id);

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
    let savedEntity = await Request.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Request
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Request.findById(req.params.id);

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

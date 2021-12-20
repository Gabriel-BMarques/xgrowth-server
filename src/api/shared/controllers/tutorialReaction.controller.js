const httpStatus = require('http-status');
const { omit } = require('lodash');
const TutorialReaction = require('../models/tutorialReaction.model');

/**
 * Create TutorialReaction
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new TutorialReaction(req.body);
    entity.createdBy = req.user._id;

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get TutorialReaction
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await TutorialReaction.findById(req.params.id);

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
 * List TutorialReaction
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    const entities = await TutorialReaction.find(query);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    const newEntities = entities;

    res.status(httpStatus.OK);
    res.json(newEntities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing TutorialReaction
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new TutorialReaction(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await TutorialReaction.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    let savedEntity = await TutorialReaction.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete TutorialReaction
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await TutorialReaction.findById(req.params.id);

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
const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Collection = require('../models/collections.model');
const Post = require('../../post/model/post.model');
const mongoose = require('mongoose');
const PostSchema = require('../../post/model/post.model');

/**
 * Create Post
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Collection(req.body);
    entity.CreatedBy = req.user.id;
    entity.UserId = req.user.id;
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Post
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Collection.findById(req.params.id).populate('postsIds', null, Post);

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
 * List Posts By current user id
 * @public
 */
exports.listByCurrentUserId = async (req, res, next) => {
  try {
    const entities = await Collection.find({ UserId: mongoose.Types.ObjectId(req.user.id) })
      .populate('postsIds', null, PostSchema);

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
};

/**
 * List Posts By current user id
 * @public
 */
/* exports.listByCurrentUserDomain = async (req, res, next) => {
  try {
    const domain = req.user.email.split('@')[1];
    const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });

    let entities = await Collection.find({ companyProfileId: companyProfile._id });

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
}; */

/**
 * List Posts
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await Collection.find(query).populate('postsIds', null, Post);

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
 * Update an existing Post
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Collection(req.body);
    entity.postsIds = entity.postsIds.filter((value, index, self) => {
      return self.indexOf(value) === index;
    })
    entity.updatedBy = req.user._id;
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Collection.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await Collection.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Collection
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Collection.findById(req.params.id);
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

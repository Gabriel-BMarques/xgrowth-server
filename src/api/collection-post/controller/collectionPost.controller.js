/* eslint-disable max-len */
const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const CollectionPost = require('../models/collectionPost.model');
const mongoose = require('mongoose');
const PostSchema = require('../../post/model/post.model');

/**
 * Create Collection Post
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new CollectionPost(req.body);
    if (req.user) {
      entity.CreatedBy = req.user._id;
    } else {
      entity.userId = 'admin';
    }

    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

exports.listByCollectionId = async (req, res, next) => {
  try {
    const entities = await CollectionPost.find({ CollectionId: mongoose.Types.ObjectId(req.params.id) })
      .populate('PostId', null, PostSchema);

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
 * Get Collection Post
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await CollectionPost.findById(req.params.id);

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
 * List Collection Posts By current user id
 * @public
 */
exports.listByCurrentUserId = async (req, res, next) => {
  try {
    let entities = await CollectionPost.find({ createdBy: req.user._id });

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
 * List Collection Posts By current user id
 * @public
 */
/* exports.listByCurrentUserDomain = async (req, res, next) => {
  try {
    const domain = req.user.email.split('@')[1];
    const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });

    let entities = await CollectionPost.find({ companyProfileId: companyProfile._id });

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
 * List Collection Posts
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await CollectionPost.find(query);

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
 * Update an existing Collection Post
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CollectionPost(req.body);
    entity.updatedBy = req.user._id;
    // const domain = req.user.email.split('@')[1];
    // const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });
    // entity.companyProfileId = companyProfile._id;
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await CollectionPost.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await CollectionPost.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Collection Post
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await CollectionPost.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    // const domain = req.user.email.split('@')[1];
    // const companyProfile = await CompanyProfile.findById(entity.companyProfileId);

    // if (domain.toString() !== companyProfile.allowedDomain.toString()) {
    //   res.status(httpStatus.FORBIDDEN);
    //   res.json('Forbidden.');
    //   return next();
    // }

    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};

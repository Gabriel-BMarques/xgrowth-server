const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const BriefMember = require('../model/briefMember.model');
const mongoose = require('mongoose');
const User = require('../../user/model/user.model');

/**
 * Create BriefMember
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new BriefMember(req.body);
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

/**
 * Get BriefMember
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await BriefMember.findById(req.params.id);

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
 * List Members By current user id
 * @public
 */
exports.listByBriefId = async (req, res, next) => {
  try {
    // eslint-disable-next-line max-len
    let entities = await BriefMember.find({ BriefId: mongoose.Types.ObjectId(req.params.id) }).populate('UserId', null, User);

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
 * List Categories
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await BriefMember.find(query)
      .populate('UserId');

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
 * Update an existing BriefMember
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new BriefMember(req.body);
    // const domain = req.user.email.split('@')[1];
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await BriefMember.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    entity.updatedBy = req.user._id;
    const savedEntity = await BriefMember.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete BriefMember
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await BriefMember.findById(req.params.id);

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

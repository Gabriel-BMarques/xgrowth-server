const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const CategoryClient = require('../model/categoryClient.model');
const mongoose = require('mongoose');

/**
 * Create CategoryClient
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new CategoryClient(req.body);
    if (req.user) {
      entity.CreatedBy = req.user._id;

      // const domain = req.user.email.split('@')[1];
      // const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });
      // Fazer condição para allowed domain aqui <FEA GAB0001>
      // entity.companyProfileId = companyProfile._id;
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
 * Get CategoryClient
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await CategoryClient.findById(req.params.id);

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
 * List Categories By current user id
 * @public
 */
exports.listByClientId = async (req, res, next) => {
  try {
    let entities = await CategoryClient.find({ clientId: mongoose.Types.ObjectId(req.params.id) })
      .populate('categoryId');

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
 * List Categories By current user id
 * @public
 */
exports.listByCurrentUserDomain = async (req, res, next) => {
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
};

/**
 * List Categories
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await CategoryClient.find(query);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing CategoryClient
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CategoryClient(req.body);
    entity.updatedBy = req.user._id;
    // const domain = req.user.email.split('@')[1];
    // const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });
    // entity.companyProfileId = companyProfile._id;
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await CategoryClient.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await CategoryClient.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CategoryClient
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await CategoryClient.findById(req.params.id);

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

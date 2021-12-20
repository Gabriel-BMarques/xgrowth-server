const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const CategoryOfUser = require('../model/categoryOfUser.model');

/**
 * Create CategoryOfUser
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new CategoryOfUser(req.body);
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
 * Get CategoryOfUser
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await CategoryOfUser.findById(req.params.id);

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
exports.listByUserCategoryId = async (req, res, next) => {
  try {
    let entities = await CategoryOfUser.find({ _id: req.params.CategoryOfUserId });

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
    let entities = await CategoryOfUser.find(query);

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
 * Update an existing CategoryOfUser
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CategoryOfUser(req.body);
    const domain = req.user.email.split('@')[1];
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await CategoryOfUser.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (domain.toString() !== companyProfile.allowedDomain.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    entity.updatedBy = req.user._id;
    const savedEntity = await CategoryOfUser.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CategoryOfUser
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await CategoryOfUser.findById(req.params.id);

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

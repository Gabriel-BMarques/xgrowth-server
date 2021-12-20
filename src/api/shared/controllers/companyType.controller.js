const httpStatus = require('http-status');
const { omit } = require('lodash');
const CompanyType = require('../models/companyType.model');

/**
 * Create CompanyType
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new CompanyType(req.body);
    entity.createdBy = req.user._id;

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get CompanyType
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    console.log('GET');
    const entity = await CompanyType.findById(req.params.id);

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
 * List CompanyType
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    const entities = await CompanyType.find(query);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    const newEntities = entities;
    newEntities.sort((a, b) => {
      const nameA = a.name.toLowerCase(); const
        nameB = b.name.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });

    res.status(httpStatus.OK);
    res.json(newEntities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing CompanyType
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CompanyType(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await CompanyType.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    let savedEntity = await CompanyType.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CompanyType
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await CompanyType.findById(req.params.id);

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

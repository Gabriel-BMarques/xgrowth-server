const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const CategoryOrganization = require('../models/categoryOrganization.model');
 
/**
 * Create categoryOrganization
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const categoryOrganization = new CategoryOrganization(req.body);
    const saved = await categoryOrganization.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};
 
/**
 * Get categoryOrganization list
 * @public
 */
exports.listAll = async (req, res, next) => {
  try {
    const query = req.query || {};
    const list = await CategoryOrganization.find(query).populate('segment');
    const newList = list.sort((a, b) => {
      const nameA = a.name.toLowerCase(); const
      nameB = b.name.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });

    res.status(httpStatus.OK);
    res.json(newList);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing CategoryOrganization
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CategoryOrganization(req.body);
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await CategoryOrganization.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    entity.updatedBy = req.user._id;
    const savedEntity = await CategoryOrganization.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CategoryOrganization
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await CategoryOrganization.findById(req.params.id);

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


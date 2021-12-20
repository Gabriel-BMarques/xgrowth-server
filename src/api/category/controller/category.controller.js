const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Category = require('../models/category.model');
const CategoryClient = require('../../category-client/model/categoryClient.model');
const CompanyRelation = require('../../company-relation/model/companyRelation.model');

/**
 * Create Category
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Category(req.body);
    if (!entity.OrganizationId || entity.OrganizationId === '') {
      entity.OrganizationId = null;
    }
    if (!entity.ParentId || entity.ParentId === '') {
      entity.ParentId = null;
    }
    if (req.user) {
      entity.CreatedBy = req.user._id;
      // const domain = req.user.email.split('@')[1];
      // const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });
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
 * Get Category
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Category.findById(req.params.id);

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


exports.listAll = async (req, res, next) => {
  try {
    const entities = await Category.find();

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
 * List Categories By current user company
 * @public
 */
exports.listByCurrentCompany = async (req, res, next) => {
  try {
    const companyRelations = await CompanyRelation.find({
      $or: [
        { companyA: req.user.company },
        { companyB: req.user.company }
      ]
    });

    const companyRelationsIds_A = companyRelations.map(compRel => compRel.companyA);
    const companyRelationsIds_B = companyRelations.map(compRel => compRel.companyB);

    const categoryCompanies = await CategoryClient.find({
      $or: [
        { clientId: { $in: companyRelationsIds_A } },
        { clientId: { $in: companyRelationsIds_B } },
        { clientId: { $in: req.user.company } },
      ]
    });
    const categoryIds = categoryCompanies.map(category => category.categoryId);

    const query = { $or: [
        { _id: { $in: categoryIds } },
        { isPublic: true }
      ]
    };

    let entities = await Category.find(query);

    if (!entities) {
      entities = await Category.find({ isPublic: true });
      if (!entities) {
        res.status(httpStatus.NOT_FOUND);
        res.json('Not found.');
        return next();
      }
    }
     entities.sort((a, b) => {
      const nameA = a.name.toLowerCase(); 
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });
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
 * List Categories By current user company
 * @public
 */
exports.listCategoriesForInterests = async (req, res, next) => {
  try {
    const companyRelations = await CompanyRelation.find({
      $or: [
        { companyA: req.user.company },
        { companyB: req.user.company }
      ]
    });

    const companyRelationsIds_A = companyRelations.map(compRel => compRel.companyA);
    const companyRelationsIds_B = companyRelations.map(compRel => compRel.companyB);

    const categoryCompanies = await CategoryClient.find({
      $or: [
        { clientId: { $in: companyRelationsIds_A } },
        { clientId: { $in: companyRelationsIds_B } },
        { clientId: { $in: req.user.company } },
      ]
    });
    const categoryIds = categoryCompanies.map(category => category.categoryId);

    const query = { $or: [
        { _id: { $in: categoryIds } },
        { isPublic: true }
      ]
    };

    let entities = await Category.find(query);

    if (!entities) {
      entities = await Category.find({ isPublic: true });
      if (!entities) {
        res.status(httpStatus.NOT_FOUND);
        res.json('Not found.');
        return next();
      }
    }
     entities.sort((a, b) => {
      const nameA = a.name.toLowerCase(); 
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });
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
 * List Categories
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await Category.find(query)
      .populate('parentId');

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
 * Update an existing Category
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Category(req.body);
    if (!entity.OrganizationId || entity.OrganizationId === '') {
      entity.OrganizationId = null;
    }
    if (!entity.ParentId || entity.ParentId === '') {
      entity.ParentId = null;
    }
    entity.updatedBy = req.user._id;
    // const domain = req.user.email.split('@')[1];
    // const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });
    // entity.companyProfileId = companyProfile._id;
    const newEntity = omit(entity.toObject(), '_id', '__v', 'createdAt', 'updatedAt');
    const oldEntity = await Category.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await Category.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Category
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Category.findById(req.params.id);

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

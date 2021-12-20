const httpStatus = require('http-status');
const {
  omit,
  map
} = require('lodash');
const CompanyRelation = require('../../company-relation/model/companyRelation.model');
const Organization = require('../../organization/model/organization.model');
const mongoose = require('mongoose');
const companyRelationService = require('../services/companyRelation.service');


/**
 * Create Company Relation
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new CompanyRelation(req.body);
    entity.createdBy = req.user._id;
    // entity.allowedDomain = req.user.email.split('@')[1];

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Company Relation
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await CompanyRelation.findById(req.params.id);

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
 * List Company Relation Suppliers May Like
 * @public
 */
exports.listSuppliersMayLike = async (req, res, next) => {
  try {
    const userCompanyRelation = await CompanyRelation
      .findOne({
        allowedDomain: req.user.email.split('@')[1]
      });

    let entities = await CompanyRelation.list({
      _id: {
        $ne: userCompanyRelation._id
      }
    });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), [
        'annualReportsBase64',
        'institutionalPresentationBase64',
        'createdAt',
        'updatedAt',
        '__v',
      ]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Company Relation
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let query = req.query || {};

    if (req.query.text) {
      query = {
        $text: {
          $search: req.query.text
        }
      };
    }

    const entities = await CompanyRelation.find(query);

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
 * List Relations by company id
 * @public
 */
exports.listByCompanyId = async (req, res, next) => {
  try {
    const companyId = req.query.companyId || {};

    let entities = await CompanyRelation.find({
        $or: [{
            companyA: companyId
          },
          {
            companyB: companyId
          },
        ],
      })
      .populate({
        path: 'companyA',
        populate: {
          path: 'organization'
        }
      })
      .populate({
        path: 'companyB',
        populate: {
          path: 'organization',
        }
      });

    console.log(entities);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
      if (entity.companyA && entity.companyA._id.toString() === companyId) {
        return omit(entity.toObject(), ['companyA']);
      }
      return omit(entity.toObject(), ['companyB']);
    });

    const newEntities = entities;
    newEntities.sort((a, b) => {
      let nameA;
      let nameB;
      if (a.companyA) {
        nameA = a.companyA.companyName.toLowerCase();
        if (b.companyA) {
          nameB = b.companyA.companyName.toLowerCase();
        } else {
          nameB = b.companyB.companyName.toLowerCase();
        }
      } else {
        nameA = a.companyB.companyName.toLowerCase();
        if (b.companyA) {
          nameB = b.companyA.companyName.toLowerCase();
        } else {
          nameB = b.companyB.companyName.toLowerCase();
        }
      }
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    res.status(httpStatus.OK);
    res.json(newEntities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Related Organizations by company id
 * @public
 */
exports.listRelatedOrganizations = async (req, res, next) => {
  try {
    const defaultRelationQuery = {
      $or: [{
          companyA: req.user.company
        },
        {
          companyB: req.user.company
        }
      ]
    };

    const defaultOrganizationQuery = {
      _id: { $ne: mongoose.Types.ObjectId(req.user.organization) }
    }

    const filter = await companyRelationService.getFilterQuery(req);
    const search = await companyRelationService.getSearchQuery(req.query?.searchParam);

    const relations = await CompanyRelation.find({
        ...defaultRelationQuery
      })
      .populate('companyA', 'organization')
      .populate('companyB', 'organization');

    const relationsOrganizationsA = relations.map((r) => r.companyA?.organization);
    const relationsOrganizationsB = relations.map((r) => r.companyB?.organization);
    let relatedOrganizationIds = [...relationsOrganizationsA, ...relationsOrganizationsB];

    const relatedOrganizationsQuery = req.user.role !== 'admin' ? {
      _id: {
        $in: relatedOrganizationIds
      }
    } : {};

    const relatedOrganizations = await Organization
      .aggregate([
        { $sort: companyRelationService.getSort(req.query.sort) },
        {
          $match: {
            $and: [
              relatedOrganizationsQuery,
              defaultOrganizationQuery,
              filter,
              search,
            ]
          }
        },
        { $skip: parseInt(req.query.skip) },
        { $limit: 10 },
        { $lookup: companyRelationService.getLookupQuery('skills', 'skills', '_id', 'skills') },
        { $lookup: companyRelationService.getLookupQuery('segments', 'segments', '_id', 'segments') },
        { $lookup: companyRelationService.getLookupQuery('segments', 'subSegments', '_id', 'subSegments') },
        { $lookup: companyRelationService.getLookupQuery('countries', 'organizationReach', '_id', 'organizationReach') },
        { $lookup: companyRelationService.getLookupQuery('organizationtypes', 'organizationType', '_id', 'organizationType') },
        { $lookup: companyRelationService.getLookupQuery('organizationtypes', 'subType', '_id', 'subType') },
        { $lookup: companyRelationService.getLookupQuery('certifications', 'certifications', '_id', 'certifications') },
        { $lookup: companyRelationService.getLookupQuery('products', '_id', 'organization', 'products') },
        {
          $addFields: {
            products: '$products',
          }
        },
        {
          $project: {
            ...companyRelationService.solversPageProjection,
            organizationType: {
              $arrayElemAt: ["$organizationType", 0]
            },
          }
        }
      ]);

    res.status(httpStatus.OK);
    res.json(relatedOrganizations);
  } catch (error) {
    return next(error);
  }
};

exports.searchAggregate = async (req, res, next) => {
  try {
    const aggregation = {};
    const result = CompanyRelation.aggregate(aggregation);

    res.status(httpStatus.OK);
    res.json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Company Relation By userID
 * @public
 */
exports.getByUserId = async (req, res, next) => {
  try {
    let entity = await CompanyRelation.findOne({
      userId: req.user._id
    });

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (req.user._id.toString() !== entity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    entity = omit(entity.toObject(), ['userId', 'createdAt', 'updatedAt', '__v']);

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Company Relation By userID
 * @public
 */
exports.getByUserDomain = async (req, res, next) => {
  try {
    let entity = await CompanyRelation.findOne({
      allowedDomain: req.user.email.split('@')[1]
    });

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entity = omit(entity.toObject(), [
      'annualReportsBase64',
      'institutionalPresentationBase64',
      'userId',
      'createdAt',
      'updatedAt',
      '__v',
    ]);

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Company Relation By userID
 * @public
 */
exports.getByUserDomainWithAttachments = async (req, res, next) => {
  try {
    let entity = await CompanyRelation.findOne({
      allowedDomain: req.user.email.split('@')[1]
    });

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entity = omit(entity.toObject(), ['userId', 'createdAt', 'updatedAt', '__v']);

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a existing Company Relation
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CompanyRelation(req.body);
    entity.updatedBy = req.user._id;
    // entity.allowedDomain = req.user.email.split('@')[1];

    const newEntity = omit(entity.toObject(), '_id', 'createdAt', '__v');
    const oldEntity = await CompanyRelation.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    /* if (entity.allowedDomain.toString() !== oldEntity.allowedDomain.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    } */

    await oldEntity.updateOne(newEntity, {
      override: true,
      upsert: true
    });
    let savedEntity = await CompanyRelation.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Company-Relation
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await CompanyRelation.findById(req.params.id);
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
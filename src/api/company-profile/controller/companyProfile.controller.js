/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const Organization = require('../../organization/model/organization.model');
const CompanyRelation = require('../../company-relation/model/companyRelation.model');
const CompanyType = require('../../shared/models/companyType.model');
const OrganizationType = require('../../organization/model/organizationType.model');
const mongoose = require('mongoose');
/**
 * Create Company Profile
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new CompanyProfile(req.body);
    entity.createdBy = req.user._id;
    entity.allowedDomain = req.user.email.split('@')[1];

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get em Company Profile
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await CompanyProfile.findById(req.params.id)
      .populate('organization');

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

exports.listByOrganization = async (req, res, next) => {
  try {
    const entities = await CompanyProfile.find({ organization: mongoose.Types.ObjectId(req.params.id) });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not Found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List potential clients
 * @public
 */
 exports.listPotentialClients = async (req, res, next) => {
  try {
    const companyRelations = await CompanyRelation.find({ companyB: req.user.company });

    const relatedCompaniesIds = companyRelations.map(cr => {
      if (cr.companyA.toString() !== req.user.company.toString()) {
        return cr.companyA;
      }
    });

    const cpgType = await OrganizationType.findOne({ name: 'CPG Industry' });
    const currentOrganization = await Organization.findById(req.user.organization);

    let query;
    if ((currentOrganization.organizationType && currentOrganization.organizationType.toString()) === cpgType._id.toString()) {
      query = {
        _id: { $in: relatedCompaniesIds }
      }
    } else {
      const cpgOrganizations = await Organization.find({ organizationType: cpgType._id, _id: { $ne: currentOrganization._id } });
      const cpgOrganizationsIds = cpgOrganizations.map((o) => o._id);
      query = {
        $or: [
          { _id: relatedCompaniesIds },
          { organization: { $in: cpgOrganizationsIds } },
        ]
      }
    }

    const potentialClients = await CompanyProfile.find(query)
    .populate({
      path: 'organization',
      select: { name: 1 }
    })

    if (!potentialClients) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(potentialClients);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Company Profile
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let query = req.query || {};

    if (req.query.text) {
      query = { $text: { $search: req.query.text } };
    }

    const entities = await CompanyProfile.find(query).populate('organization');

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    const newEntities = entities;
    newEntities.sort((a, b) => {
      const nameA = a.companyName.toLowerCase(); const
        nameB = b.companyName.toLowerCase();
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

exports.searchAggregate = async (req, res, next) => {
  try {
    const aggregation = {};
    const result = CompanyProfile.aggregate(aggregation);

    res.status(httpStatus.OK);
    res.json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Company Profile By userID
 * @public
 */
exports.getByUserId = async (req, res, next) => {
  try {
    let entity = await CompanyProfile.findOne({ userId: req.user._id });

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
 * Get Company Profile By userID
 * @public
 */
exports.getByUserDomain = async (req, res, next) => {
  try {
    let entity = await CompanyProfile.findOne({ allowedDomain: req.user.email.split('@')[1] });

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
 * Get Company Profile By userID
 * @public
 */
exports.getByUserDomainWithAttachments = async (req, res, next) => {
  try {
    let entity = await CompanyProfile.findOne({ allowedDomain: req.user.email.split('@')[1] });

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
 * Update a existing Company Profile
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CompanyProfile(req.body);
    entity.updatedBy = req.user._id;
    // entity.allowedDomain = req.user.email.split('@')[1];

    const newEntity = omit(entity.toObject(), '_id', 'createdAt', '__v');
    const oldEntity = await CompanyProfile.findById(entity._id);

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

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    let savedEntity = await CompanyProfile.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};
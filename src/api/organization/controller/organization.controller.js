const httpStatus = require('http-status');
const { omit } = require('lodash');
const Organization = require('../../organization/model/organization.model');
const mailService = require('../../shared/services/mailService');

const companyRelationService = require('../../company-relation/services/companyRelation.service');
const Post = require('../../post/model/post.model');

/**
 * Create Organization
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    let foundOrganization = await Organization.findOne({ name: { $regex: new RegExp(req.body.name), $options: 'i' } });

    if (foundOrganization) {
      res.status(httpStatus.CONFLICT);
      res.json('ERROR: this organization name has been taken');
      return next();
    }

    let generalDomains = [
      'gmail.com',
      'hotmail.com',
      'outlook.com',
      'yahoo.com',
      'mailinator.com',
      'growinco.com',
    ];

    if (req.body.domain && !generalDomains.includes(req.body.domain)) req.body.allowedDomains = [req.body.domain];

    const entity = new Organization(req.body);
    entity.createdBy = req.user._id;

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Organization
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Organization.findOne({ _id: req.params.id })
      .populate('initiatives')
      .populate('certifications')
      .populate({
        path: 'organizationReach',
        populate: {
          path: 'globalRegion'
        }
      })
      .populate('skills')
      .populate('segments')
      .populate('subSegments')
      .populate('organizationType')
      .populate('subType')
      .populate('organizationAdmins')
      .collation({locale: "en" })
      .sort({ companyName: 1 });

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }
    req.body = entity;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * List Organization
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let query = req.query || {};

    if (req.query.text) {
      query = { $text: { $search: req.query.text } };
    }

    const entities = await Organization.find(query)
      .populate('organizationType')
      .populate('segments')
      .populate('certifications')
      .populate({
        path: 'organizationReach',
        populate: {
          path: 'globalRegion'
        }
      });
      
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

exports.searchAggregate = async (req, res, next) => {
  try {
    const aggregation = {};
    const result = Organization.aggregate(aggregation);

    res.status(httpStatus.OK);
    res.json(result);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Organization By userID
 * @public
 */
exports.getByUserDomain = async (req, res, next) => {
  try {
    const entity = await Organization.findOne({ Domain: req.user.email.split('@')[1] });

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
 * Get Organization By userID
 * @public
 */
exports.getByUserDomainWithAttachments = async (req, res, next) => {
  try {
    let entity = await Organization.findOne({ Domain: req.user.email.split('@')[1] });

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
 * Update an existing Organization
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    query = {};
    const allOrganizations = await Organization.find(query);
    let found = false;

    for (let index = 0; index < allOrganizations.length; index++) {
      const element = allOrganizations[index];
      if (element.name?.replace(' ', '').trim().toLowerCase() ===
        req.body.name?.replace(' ', '').trim().toLowerCase() && req.body._id.toString() !== element._id.toString()
      ) {
        found = true;
        break;
      }
    }
    if (found) {
      res.status(httpStatus.NOT_FOUND);
      res.json('ERROR: this organization name has been taken');
      return next();
    }

    const newEntity = req.body;
    newEntity.updatedBy = req.user._id;

    const oldEntity = await Organization.findById(newEntity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    let savedEntity = await Organization.findById(newEntity._id);
    
    savedEntity.isComplete = await savedEntity.profileComplete(savedEntity);
    if (savedEntity.isComplete) {
      await mailService.sendOrgProfileComplete(req.user);
    }
    await savedEntity.save();

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};
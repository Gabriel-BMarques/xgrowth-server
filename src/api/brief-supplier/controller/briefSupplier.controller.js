/* eslint-disable max-len */
const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const BriefSupplier = require('../model/briefSupplier.model');
const mongoose = require('mongoose');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const Collection = require('../../collections/models/collections.model');
const Brief = require('../../brief/model/brief.model');
const User = require('../../user/model/user.model');
const BriefMember = require('../../brief-member/model/briefMember.model');

/**
 * Create BriefSupplier
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new BriefSupplier(req.body);
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
 * Get BriefSupplier
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await BriefSupplier.findById(req.params.id);

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
 * List briefSuppliers By brief id
 * @public
 */
exports.listByBriefId = async (req, res, next) => {
  try {
    let entities = await BriefSupplier.find({ BriefId: mongoose.Types.ObjectId(req.params.id) }).populate('SupplierId');

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

exports.listBySupplierId = async (req, res, next) => {
  try {
    let entities = await BriefSupplier.find({ SupplierId: mongoose.Types.ObjectId(req.params.id) })
      .populate({
        path: 'BriefId',
        populate: {
          path: 'ClientId',
        }
      })
      .populate('SupplierId', null, CompanyProfile)
      .populate('CreatedBy', null, User);

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
    let entities = await BriefSupplier.find(query)
      .populate('BriefId');

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
 * List BriefSupplier By Organization
 * @public
 */
 exports.listByOrganization = async (req, res, next) => {
  try {
    const { organizationId } = req.query;
    const organizationCompanies = await CompanyProfile.find({ organization: organizationId });
    const companiesIds = organizationCompanies.map((oc) => oc._id);

    let query;

    if (req.user.role === 'admin') {
      query = { SupplierId: { $in: companiesIds } };
    } else {
      const currentUserOrganizationCompanies = await CompanyProfile.find({ organization: mongoose.Types.ObjectId(req.user.organization) });
      const currentOrgCompaniesIds = currentUserOrganizationCompanies.map((c) => c._id);
      const briefMembers = await BriefMember.find({ UserId: mongoose.Types.ObjectId(req.user._id) });
      const briefMembersBriefsIds = briefMembers.map((bm) => bm.BriefId);

      const isPublished = { 
        IsDraft: { $ne: true } 
      };
  
      const briefMembersOnly = {
        $and: [
          { MembersOnly: true },
          { _id: { $in: briefMembersBriefsIds } }
        ]
      };
  
      const organizationBriefs = {
        $and: [
          { ClientId: { $in: currentOrgCompaniesIds } },
          { MembersOnly: { $ne: true } }
        ]
      }

      const currentOrgBriefs = await Brief.find({
        $or: [
          briefMembersOnly,
          organizationBriefs
        ],
        $and: [
          isPublished
        ]
      });
      const briefsIds = currentOrgBriefs.map((b) => b._id);
      query = { SupplierId: { $in: companiesIds }, BriefId: { $in: briefsIds }};
    }

    let entities = await BriefSupplier.find(query)
      .populate({
        path: 'BriefId',
        populate: {
          path: 'ClientId'
        }
      });

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
 * Update an existing BriefSupplier
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new BriefSupplier(req.body);
    if (!entity.SignedNdaFile.url) {
      entity.SignedNdaFile = null;
    }
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await BriefSupplier.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    entity.updatedBy = req.user._id;
    const savedEntity = await BriefSupplier.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete BriefSupplier
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await BriefSupplier.findById(req.params.id);

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

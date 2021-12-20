const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Listing = require('../../listing/model/listing.model');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const mailService = require('../../shared/services/mailService');

/**
 * Create Listing
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Listing(req.body);
    entity.userId = req.user._id;

    const domain = req.user.email.split('@')[1];
    const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });

    entity.companyProfileId = companyProfile._id;
    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Listing
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Listing.findById(req.params.id);

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

    // entity = omit(entity.toObject(), 'userId')

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Listings By userId
 * @public
 */
exports.listByUserId = async (req, res, next) => {
  try {
    let entities = await Listing.find({ userId: req.user._id });

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
 * List Listings By lineId and userId
 * @public
 */
exports.listByLineIdAndUserId = async (req, res, next) => {
  try {
    let entities = await Listing.find({ userId: req.user._id, lineId: req.params.lineId });

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
 * List Listings By lineId
 * @public
 */
exports.listByLineId = async (req, res, next) => {
  try {
    let entities = await Listing.find({ lineId: req.params.lineId });

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
 * Update a existing Listing
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Listing(req.body);
    entity.userId = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Listing.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (req.user._id.toString() !== oldEntity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await Listing.findById(entity._id);
    // savedEntity = omit(savedEntity.toObject(), 'userId')

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Listing
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Listing.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    if (req.user._id.toString() !== entity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};

/**
 * Count listings by userId
 * @public
 */
exports.countByUserId = async (req, res, next) => {
  try {
    const query = { userId: req.params.userId };

    const result = await Listing.countDocuments(query);
    res.json({ count: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Send proposal for a Listing
 * @public
 */
exports.sendProposal = async (req, res, next) => {
  try {
    const { senderEmail } = req.body;
    const cost = req.body.Cost;
    const { freeCap } = req.body;
    const { proposalED } = req.body;
    const { proposalSD } = req.body;
    const { proposalLine } = req.body;
    const { message } = req.body;


    mailService.sendProposalMessage(
      senderEmail,
      cost,
      freeCap,
      proposalED,
      proposalSD,
      proposalLine,
      message,
    );

    res.status(httpStatus.OK);
    return res.json();
  } catch (err) {
    return next(err);
  }
};

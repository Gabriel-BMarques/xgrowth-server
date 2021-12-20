const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const Invite = require('../models/invite.model');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const ClientProfile = require('../../profile/models/profile.model');
const mailService = require('../services/mailService');
const generate = require('nanoid/generate');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Create Invite
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Invite(req.body);
    entity.userId = req.user._id;

    const domain = req.user.email.split('@')[1];
    entity.domain = domain;

    if (entity.email.toLowerCase().indexOf(domain) === -1) {
      res.status(httpStatus.BAD_REQUEST);
      return res.json('Invalid email domain');
    }

    const key = generate(alphabet, 12);
    entity.key = key;

    const saved = await entity.save();

    const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });
    const clientProfile = await ClientProfile.findOne({ userId: entity.userId });

    mailService.sendInviteMessage(
      entity.email,
      clientProfile.firstName,
      clientProfile.familyName,
      companyProfile.companyName,
      entity.message,
      key,
    );

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Invite
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Invite.findById(req.params.id);

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
 * List Invites By current user id
 * @public
 */
exports.listByCurrentUserId = async (req, res, next) => {
  try {
    let entities = await Invite.find({ userId: req.user._id });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Invites By current user id
 * @public
 */
exports.getCurrentUserPendingInvite = async (req, res, next) => {
  try {
    let entities = await Invite.find({ email: req.user.email, status: 'sent' });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Invites By current user id
 * @public
 */
exports.listByCurrentUserDomain = async (req, res, next) => {
  try {
    const domain = req.user.email.split('@')[1];

    let entities = await Invite.find({ domain });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Invites
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let entities = await Invite.find();

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update a existing Invite
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Invite(req.body);
    entity.userId = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Invite.findById(entity._id);

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
    const savedEntity = await Invite.findById(entity._id);
    // savedEntity = omit(savedEntity.toObject(), 'userId')

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Invite
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Invite.findById(req.params.id);

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

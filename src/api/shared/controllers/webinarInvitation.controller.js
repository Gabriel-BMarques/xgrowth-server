const httpStatus = require("http-status");
const { omit } = require("lodash");
const WebinarInvitation = require("../models/webinarInvitation.model");
const webinarInvitationService = require('../services/webinarInvitation.service');

/**
 * Create WebinarInvitation
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new WebinarInvitation(req.body);
    entity.createdBy = req.user._id;

    const saved = await entity.save();

    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get WebinarInvitation
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await WebinarInvitation.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * List WebinarInvitation
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    const entities = await WebinarInvitation.find(query);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List current user WebinarInvitation
 * @public
 */
exports.loggedUserInvitations = async (req, res, next) => {
  try {
    let entities = await WebinarInvitation.aggregate(webinarInvitationService.listInvitationsAggregation(req));

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List WebinarInvitation
 * @public
 */
exports.listPopulated = async (req, res, next) => {
  try {
    const query = req.query || {};

    const entities = await WebinarInvitation.find(query).populate({
      path: "invitedUserId",
      populate: {
        path: "company",
        model: "CompanyProfile",
        select: { companyName: 1, organization: 1 },
        populate: {
          path: "organization",
          model: "Organization",
          select: { name: 1 },
        },
      },
    });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing WebinarInvitation
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new WebinarInvitation(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), "_id", "__v");
    const oldEntity = await WebinarInvitation.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    let savedEntity = await WebinarInvitation.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), "userId");

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete WebinarInvitation
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await WebinarInvitation.findById(req.params.id);

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

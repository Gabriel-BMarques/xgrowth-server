const httpStatus = require('http-status');
const { omit } = require('lodash');
const Segment = require('../model/segment.model');
const Skill = require('../model/skills.model');

/**
 * Create Segment
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const segment = new Segment(req.body);
    const saved = await segment.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Segment
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Segment.findById(req.params.id);

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
 * List Segments
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    const list = await Segment.find(
      {
        $and: [
          { parentId: undefined },
          query
        ]
      }
    ).populate('parentId').sort({ name: 1 });

    if (!list) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: No segments found');
    }

    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    return next(error);
  }
};

exports.listSubSegments = async (req, res, next) => {
  try {
    const query = req.query || {};
    const entities = await Segment
      .find({ parentId: { $ne: undefined } })
      .populate('parentId')
      .sort({ name: 1 });

    // console.log('SUB SEGMENTS', entities);
    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: No subsegments found.');
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
}

/**
 * Update an existing Segment
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Segment(req.body);
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Segment.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    entity.updatedBy = req.user._id;
    const savedEntity = await Segment.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Segment
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Segment.deleteOne ({_id : req.params.id});
   
    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    const skill = await Skill.find({ segment: req.params.id });
    if(skill){
      await Skill.deleteMany({segment: req.params.id});
    }
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};
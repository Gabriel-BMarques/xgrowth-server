const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const _ = require('lodash');
const Skills = require('../model/skills.model');

/**
 * Create Skills
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Skills(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Skills
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Skills.findById(req.params.id);

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
 * List Categories
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await Skills.find(query).populate('segment').sort({ name: 1 });
    
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

exports.listBySegment = async (req, res, next) => {
  try {
    const query = req.query || {}
    const entities = await Skills.find(
      {
        $and: [
          { segment: { $ne: undefined } },
          query
        ]
      }
    ).populate('segment').sort({ name: 1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: No skills found');
    }

    let segments = entities.map((c) => {
      return { 
        _id: c.segment._id,
        segment: c.segment.name,
        skills: []
      }
    });

    segments = _.uniqWith(segments, _.isEqual);

    segments.map((seg) => {
      seg.skills = entities
        .filter((sk) => sk.segment._id.toString() === seg._id.toString())
        .map((sk) => {
          return {
            _id: sk._id,
            name: sk.name
          }
        });
    });

    const list = segments;
    list.sort((a, b) => {
      if (a.segment > b.segment) {
        return 1;
      }
      if (a.segment < b.segment) {
        return -1;
      }
      return 0;
    });

    res.status(httpStatus.OK);
    return res.json(list); 
  } catch (error) {
    return next (error);
  }
}

/**
 * Update an existing Skills
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Skills(req.body);
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await Skills.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    entity.updatedBy = req.user._id;
    const savedEntity = await Skills.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Skills
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Skills.findById(req.params.id);

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

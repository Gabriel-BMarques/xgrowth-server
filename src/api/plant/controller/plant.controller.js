const httpStatus = require('http-status');
const Plant = require('../models/plant.model');
const lineController = require('../../line/controller/line.controller');
const Line = require('../../line/models/line.model');
const Product = require('../../product/model/product.model');
const mongoose = require('mongoose');
const plantService = require('../services/plant.service');

const { omit } = require('lodash');

function preparePlantStructure(plants, lines, products) {
  if (Array.isArray(plants)) {
    plants.forEach((pl) => {
      pl.lines = lines?.filter((l) => l.plantId.toString() === pl._id.toString());
      pl.lines?.forEach((l) => {
        l.products = products.filter((pr) => pr.lineId.toString() === l._id.toString());
      });
    });
  } else {
    plants.lines = lines?.filter((l) => l.plantId.toString() === plants._id.toString());
    plants.lines?.forEach((l) => {
      l.products = products.filter((pr) => pr.lineId.toString() === l._id.toString());
    });
  }
}

/**
 * Create Plant
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Plant(req.body);
    entity.createdBy = req.user._id;
    entity.company = req.user.company;
    entity.organization = req.user.organization;
    const savedEntity = await entity.save();
    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update Plant
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    let newEntity = omit(req.body, 'lines');
    newEntity.updatedBy = req.user._id;
    const oldEntity = await Plant.findById(newEntity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: There is no corresponding entity to update.');
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    const updatedEntity = await Plant.findById(newEntity._id);
    res.status(httpStatus.OK);
    res.json(updatedEntity);
  } catch (error) {
    return next(error);
  }
};

exports.count = async (req, res, next) => {
  try {
    const query = req.query || {};
    let count = await Plant.count(query);
    res.status(httpStatus.OK);
    res.json(count);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Plant
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    let entities = await Plant.find(query)
      .populate('city')
      .populate('country')
      .populate('stateProvince')
      .lean();

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('Not found.');
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.listGroupBy = async (req, res, next) => {
  try {
    console.log('AQUI ESSA BOSTA');
    let entities = await Plant.aggregate(plantService.groupByCityAggregation(req));

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('Not found.');
    }

    res.status(httpStatus.OK);
    res.json(entities);    
  } catch (error) {
    return next(error);
  }
};

exports.listPlantProducts = async (req, res, next) => {
  try {
    const query = req.query || {};
    const plantId = req.params.id;

    const lineIds = (await Line.find({ plantId }, { _id: 1 }).lean()).map((l) => l._id);
    const entities = await Product.find({ lineId: { $in: lineIds } }).sort({ name: 1, createdAt: -1 });
    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('Not found.');
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Plant
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entityid = req.params.id;
    const entity = await Plant.findById(entityid);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: Plant has been deleted or it does not exists');
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Plant
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const entityId = req.params.id;
    const entity = await Plant.findById(entityId);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: Plant has already been deleted or it does not exists');
    }

    await Plant.findByIdAndDelete(entityId).exec();
    res.status(httpStatus.OK);
    res.json('SUCCESS: Plant type deleted');
  } catch (error) {
    return next(error);
  }
};

exports.createFullStructure = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    req.body.company = req.user.company;
    req.body.organization = req.user.organization;
    const plant = new Plant(req.body);
    const savedPlant = await plant.save();
    let response; 
    if (req.body.lines) response = await lineController.createLinesFromPlant(savedPlant._id, req.user, req.body.lines);
    if (response) {
      response.plant = savedPlant;
    } else {
      response = { plant: savedPlant };
    }
    preparePlantStructure(response.plant, response.lines, Array.prototype.concat.apply([], response.products));
    res.status(httpStatus.OK);
    res.json(response.plant);
  } catch (error) {
    return next(error);
  }
};

exports.listFullStructure = async (req, res, next) => {
  try {
    let entities = await Plant.aggregate(plantService.listFullStructureAggregation(req));

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('Not found.');
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.updateFullStructure = async (req, res, next) => {
  try {
    const newPlant = omit(req.body, 'lines');
    newPlant.updatedBy = req.user._id;
    const oldEntity = await Plant.findById(newPlant._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: There is no corresponding entity to update.');
    }

    await oldEntity.updateOne(omit(newPlant, '_id'), { override: true, upsert: true });
    const updatedEntity = await Plant.findById(newPlant._id);
    let response;

    if (req.body.lines) {
      response = await lineController.updateLinesFromPlant(newPlant._id, req.user, req.body.lines);
    }

    if (response) {
      response.plant = updatedEntity;
    } else {
      response = { plant: updatedEntity };
    }

    preparePlantStructure(response.plant, response.lines, Array.prototype.concat.apply([], response.products));

    res.status(httpStatus.OK);
    res.json(response.plant);
  } catch (error) {
    return next(error);
  }
};

const httpStatus = require('http-status');
const Line = require('../models/line.model');
const productController = require('../../product/controller/product.controller');
const lineService = require('../services/line.service');
const { omit } = require('lodash');

/**
 * Create Line
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Line(req.body);
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
 * Update Line
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    let newEntity = omit(req.body, 'products');
    newEntity.updatedBy = req.user._id;
    const oldEntity = await Line.findById(newEntity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: There is no corresponding entity to update.');
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    const updatedEntity = await Line.findById(newEntity._id);
    res.status(httpStatus.OK);
    res.json(updatedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Line
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await Line.find(query).sort({ name: 1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('Not found.');
    }

    entities = entities.sort((a, b) => {
      if (a.name === 'Not Existent') return -1;
      if (b.name === 'Not Existent') return 1;

      return 0;
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Line
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entityid = req.params.id;
    const entity = await Line.findById(entityid);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: Line has been deleted or it does not exists');
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Line
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const entityId = req.params.id;
    const entity = await Line.findById(entityId);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: Line has already been deleted or it does not exists');
    }

    await entity.remove();

    res.status(httpStatus.OK);
    res.json('SUCCESS: Line type deleted');
  } catch (error) {
    return next(error);
  }
};

exports.listLinesWithProducts = async (req, res, next) => {
  try {
    console.log('teste');
    let entities = await Line.aggregate(lineService.lineWithProductsAggregation(req));

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('ERROR: Unable to find any lines with this parameters');
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
}

exports.createLinesFromPlant = async (plantId, user, lines) => {
  try {
    const newProducts = [];
    const newLines = lines.map((l) => {
      const newLine = new Line({
        name: l.name,
        plantId: plantId,
        organization: user.organization,
        company: user.company,
        createdBy: user._id,
      });
      if (l.products) newProducts.push(
        l.products.map((p) => {
          p.lineId = newLine._id;
          p.plantId = newLine.plantId;
          return p;
        })
      );
      return newLine;
    });
    Line.insertMany(newLines);
    let productsCreated;
    if (newProducts?.length > 0) productsCreated = await productController.createProductsFromLines(newProducts, user);
    return { lines: newLines, products: productsCreated };
  } catch (error) {
    console.log(error);
  }
};

exports.updateLinesFromPlant = async (plantId, user, lines) => {
  try {
    const linesToCreate = lines.filter((l) => l._id === undefined);
    const linesToUpdate = lines.filter((l) => l._id !== undefined);

    let createResponse = await this.createLinesFromPlant(plantId, user, linesToCreate);
    if (!createResponse) {
      createResponse = { lines: [], products: [] };
    }
    const updatedLines = [];
    const newProducts = [];
    const linesIds = [];
    for await (const line of linesToUpdate) {
      newProducts.push(
        line.products.map((p) => {
          p.lineId = line._id;
          p.plantId = line.plantId;
          return p;
        })
      );
      const newLine = omit(line, 'products');
      const updatedLine = await Line.findByIdAndUpdate(
        newLine._id,
        { override: true, upsert: true },
        { new: true }
      ).lean();
      linesIds.push(updatedLine._id);
      updatedLines.push(updatedLine);
    }

    let updateResponse = await productController.updateProductsFromLine(newProducts, linesIds, user);
    if (!updateResponse) {
      updateResponse = { products: [] };
    }

    const response = {
      lines: createResponse.lines.concat(updatedLines),
      products: createResponse.products.concat(updateResponse.products),
    };

    return response;
  } catch (error) {
    console.log(error);
  }
};

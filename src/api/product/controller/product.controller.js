const httpStatus = require('http-status');
const Product = require('../model/product.model');
const { isNil } = require('lodash');
const mongoose = require('mongoose');
const productService = require('../services/product.service');

/**
 * Create Product
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Product(req.body);
    entity.createdBy = req.user._id;
    entity.organization = req.user.organization;
    entity.company = req.user.company;
    const savedEntity = await entity.save();
    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update Product
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const newEntity = req.body;
    newEntity.updatedBy = req.user._id;
    const oldEntity = await Product.findById(newEntity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: There is no corresponding entity to update.');
    }

    await oldEntity.updateOne(newEntity, { override: true, upsert: true });
    const updatedEntity = await Product.findById(newEntity._id);
    res.status(httpStatus.OK);
    res.json(updatedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Product
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let { perPage } = query || 9;
    let { page } = query || 1;

    perPage = parseInt(perPage, 10);
    page = parseInt(page, 10);

    const { organization } = query;

    let entities = await Product.find({ organization: mongoose.Types.ObjectId(organization) })
      .populate('lineId')
      .populate({
        path: 'plantId',
        populate: {
          path: 'city',
          model: 'City',
          populate: {
            path: 'countryId',
            model: 'Country',
          },
        },
      })
      .populate('salesMarket')
      .skip(page > 0 ? (page - 1) * page : 0)
      .limit(perPage)
      .sort({ createdAt: -1 })
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

/**
 * List Product
 * @public
 */
 exports.listGroupedByCity = async (req, res, next) => {
  try {
    let entities = await Product.aggregate(productService.groupByCityAggregation(req));

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
 * Get Product
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entityid = req.params.id;
    const entity = await Product.findById(entityid);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: Product has been deleted or it does not exists');
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Product
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const entityId = req.params.id;
    const entity = await Product.findById(entityId);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: Product has already been deleted or it does not exists');
    }

    await entity.remove();

    res.status(httpStatus.OK);
    res.json('SUCCESS: Product type deleted');
  } catch (error) {
    return next(error);
  }
};

exports.createProductsFromLines = async (productsArray, user) => {
  try {
    let productsToCreate = [];
    const newProducts = productsArray.map((products) => {
      products = products?.map((p) => {
        return new Product({
          name: p.name,
          lineId: p.lineId,
          plantId: p.plantId,
          organization: user.organization,
          company: user.company,
          createdBy: user._id,
        });
      });
      productsToCreate = productsToCreate.concat(products);
      return products;
    });
    await Product.insertMany(productsToCreate);
    return newProducts;
  } catch (error) {
    console.log(error);
  }
};

exports.updateProductsFromLine = async (productsArray, linesIds, user) => {
  try {
    let productsToCreate = [];
    let productsToRemove = [];

    const newProducts = [];
    for await (let [index, products] of productsArray.entries()) {
      const oldLineProducts = await Product.find({ lineId: linesIds[index] });
      products = products
        .map((p) => {
          if (!p._id) {
            const newProduct = new Product({
              name: p.name,
              lineId: p.lineId,
              plantId: p.plantId,
              organization: user.organization,
              company: user.company,
              createdBy: user._id,
            });
            productsToCreate.push(newProduct);
            return newProduct;
          }

          if (!oldLineProducts.some((olp) => olp.name.trim().toLowerCase() == p.name.trim().toLowerCase())) {
            productsToRemove.push(p._id);
            return null;
          }

          return p;
        })
        .filter((p) => !isNil(p));
      newProducts.push(products);
    }

    if (productsToCreate.length > 0) await Product.insertMany(productsToCreate);
    if (productsToRemove.length > 0) {
      await Product.deleteMany({ _id: { $in: productsToRemove } }).exec();
    }
    return { products: newProducts };
  } catch (error) {
    console.log(error);
  }
};

const httpStatus = require('http-status');
const PostRating = require('../model/postRating.model');

/**
 * Create post rating
 * @public
 */
 exports.create = async (req, res, next) => {
    try {
      const entity = new PostRating(req.body);
      entity.user = req.user._id;
      entity.organization = req.user.organization;
      const savedEntity = await entity.save(req);
      res.status(httpStatus.OK);
      res.json(savedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * Update post rating
   * @public
   */
  exports.update = async (req, res, next) => {
    try {
      let newEntity = req.body;
      const oldEntity = await PostRating.findById(newEntity._id);
  
      if (!oldEntity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: There is no corresponding entity to update.');
      }
  
      await oldEntity.updateOne(newEntity, { override: true, upsert: true });
      const updatedEntity = await PostRating.findById(newEntity._id);
      res.status(httpStatus.OK);
      res.json(updatedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * List post rating
   * @public
   */
  exports.list = async (req, res, next) => {
    try {
      const query = req.query || {};
      let entities = await PostRating.find(query).populate('organization');
      
      if (!entities) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('Not found.');
      }

      res.status(httpStatus.OK);
      res.json(entities);
    } catch (error) {
        return next(error)
    }
  }
  
  /**
   * Delete post rating
   * @public
   */
  exports.delete = async (req, res, next) => {
    try {
      const entityId = req.params.id;
      const entity = await PostRating.findById(entityId);
  
      if (!entity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: post rating has already been deleted or it does not exists');
      }
  
      await PostRating.findByIdAndDelete(entityId).exec();
      res.status(httpStatus.OK);
      res.json('SUCCESS: post rating deleted');
    } catch (error) {
      return next(error);
    }
  }
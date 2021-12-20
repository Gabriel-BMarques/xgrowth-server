const httpStatus = require('http-status');
const Initiative = require('../model/initiative.model');

/**
 * Create Initiative Type
 * @public
 */
 exports.create = async (req, res, next) => {
    try {
      const entity = new Initiative(req.body);
      const entityExists = await Initiative.findOne(
        { name: entity.name },
      );
      if (entityExists) {
        res.status(httpStatus.CONFLICT);
        return res.json('CONFLICT: This initiative type name is already taken.');
      }
      const savedEntity = await entity.save();
      res.status(httpStatus.OK);
      res.json(savedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * Update Initiative Type
   * @public
   */
  exports.update = async (req, res, next) => {
    try {
      let newEntity = req.body;
      const oldEntity = await Initiative.findById(newEntity._id);
  
      if (!oldEntity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: There is no corresponding entity to update.');
      }
  
      await oldEntity.updateOne(newEntity, { override: true, upsert: true });
      const updatedEntity = await Initiative.findById(newEntity._id);
      res.status(httpStatus.OK);
      res.json(updatedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * List Initiative Type
   * @public
   */
  exports.list = async (req, res, next) => {
    try {
      const query = req.query || {};
      let entities = await Initiative.find(query).sort({ name: 1 });
      
      if (!entities) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('Not found.');
      }
  
      entities = entities.sort((a, b) => {
        if (a.name === 'Not Existent')
          return -1;
        if (b.name === 'Not Existent')
          return 1;

        return 0;
      });

      res.status(httpStatus.OK);
      res.json(entities);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * Delete Initiative Type
   * @public
   */
  exports.delete = async (req, res, next) => {
    try {
      const entityId = req.params.id;
      const entity = await Initiative.findById(entityId);
  
      if (!entity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: Initiative has already been deleted or it does not exists');
      }
  
      await Initiative.findByIdAndDelete(entityId).exec();
      res.status(httpStatus.OK);
      res.json('SUCCESS: Initiative type deleted');
    } catch (error) {
      return next(error);
    }
  }
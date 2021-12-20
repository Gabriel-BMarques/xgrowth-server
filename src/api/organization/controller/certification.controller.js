const httpStatus = require('http-status');
const { listeners } = require('../model/certification.model');
const Certification = require('../model/certification.model');

/**
 * Create certification
 * @public
 */
 exports.create = async (req, res, next) => {
    try {
      const entity = new Certification(req.body);
      const entityExists = await Certification.findOne(
        { name: entity.name },
      );
      if (entityExists) {
        res.status(httpStatus.CONFLICT);
        return res.json('CONFLICT: This certification name is already taken.');
      }
      const savedEntity = await entity.save();
      res.status(httpStatus.OK);
      res.json(savedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * Update certification
   * @public
   */
  exports.update = async (req, res, next) => {
    try {
      let newEntity = req.body;
      const oldEntity = await Certification.findById(newEntity._id);
  
      if (!oldEntity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: There is no corresponding entity to update.');
      }
  
      await oldEntity.updateOne(newEntity, { override: true, upsert: true });
      const updatedEntity = await Certification.findById(newEntity._id);
      res.status(httpStatus.OK);
      res.json(updatedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * List certification
   * @public
   */
  exports.list = async (req, res, next) => {
    try {
      const query = req.query || {};
      let entities = await Certification.find(query).sort({ name: 1 });
      
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
  
    }
  }
  
  /**
   * Delete certification
   * @public
   */
  exports.delete = async (req, res, next) => {
    try {
      const entityId = req.params.id;
      const entity = await Certification.findById(entityId);
  
      if (!entity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: certification has already been deleted or it does not exists');
      }
  
      await Certification.findByIdAndDelete(entityId).exec();
      res.status(httpStatus.OK);
      res.json('SUCCESS: certification deleted');
    } catch (error) {
      return next(error);
    }
  }
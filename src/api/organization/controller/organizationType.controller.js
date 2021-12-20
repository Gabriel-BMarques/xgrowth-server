const httpStatus = require('http-status');
const OrganizationType = require('../model/organizationType.model');

/**
 * Create Organization Type
 * @public
 */
 exports.create = async (req, res, next) => {
    try {
      const entity = new OrganizationType(req.body);
      const entityExists = await OrganizationType.findOne(
        { name: entity.name },
      );
      if (entityExists) {
        res.status(httpStatus.CONFLICT);
        return res.json('CONFLICT: This organization type name is already taken.');
      }
      const savedEntity = await entity.save();
      res.status(httpStatus.OK);
      res.json(savedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * Update Organization Type
   * @public
   */
  exports.update = async (req, res, next) => {
    try {
      let newEntity = req.body;
      const oldEntity = await OrganizationType.findById(newEntity._id);
  
      if (!oldEntity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: There is no corresponding entity to update.');
      }
  
      await oldEntity.updateOne(newEntity, { override: true, upsert: true });
      const updatedEntity = await OrganizationType.findById(newEntity._id);
      res.status(httpStatus.OK);
      res.json(updatedEntity);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * List Organization Type
   * @public
   */
  exports.list = async (req, res, next) => {
    try {
      const query = req.query || {};
      const parentTypeQuery = { parentId: null };
      let entities = await OrganizationType.find({ ...query, ...parentTypeQuery }).sort({ name: 1 });

      if(req.user.role !== "admin"){
        entities = entities.filter(i => (i.name != "CPG Industry"));
      }

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

  exports.listSubTypes = async (req, res, next) => {
    try {
      const query = req.query || {};
      const subTypeQuery = { parentId: { $ne: null } };
      const entities = await OrganizationType.find({ ...query, ...subTypeQuery }).sort({ name: 1 });

      if (!entities) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('Not Found.');
      }

      res.status(httpStatus.OK);
      res.json(entities);
    } catch (error) {
      return next(error);
    }
  }
  
  /**
   * Delete Organization Type
   * @public
   */
  exports.delete = async (req, res, next) => {
    try {
      const entityId = req.params.id;
      const entity = await OrganizationType.findById(entityId);
  
      if (!entity) {
        res.status(httpStatus.NOT_FOUND);
        return res.json('ERROR: Organization Type has already been deleted or it does not exists');
      }
  
      await OrganizationType.findByIdAndDelete(entityId).exec();
      res.status(httpStatus.OK);
      res.json('SUCCESS: Organization type deleted');
    } catch (error) {
      return next(error);
    }
  }
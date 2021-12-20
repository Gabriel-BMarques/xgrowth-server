const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const NotificationDevice = require('../model/notificationDevice.model');
const pushNotificationService = require('../../shared/services/pushNotificationService');
/**
 * Create NotificationDevice
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const installation = req.body;
    installation.installationId = req.user.id;

    if (installation.registrationType === 'FCM') {
      // FCM
      // https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.notificationhubs.notificationplatform?view=azure-dotnet
      installation.platform = 4;
    } else {
      // APNS
      installation.platform = 2;
    }

    const entity = new NotificationDevice(installation);
    entity.userId = req.user.id;

    delete installation.registrationType;

    await pushNotificationService.createOrUpdateInstallation(installation, {}, (error) => {
    });

    const oldEntity = await NotificationDevice.findOne({ userId: req.user._id });
    let savedEntity;

    if (!oldEntity) {
      entity.createdBy = req.user._id;
      savedEntity = await entity.save();
    } else {
      entity.updatedBy = req.user._id;

      const newEntity = omit(entity.toObject(), '_id', '__v');

      if (req.user._id.toString() !== oldEntity.userId.toString()) {
        res.status(httpStatus.FORBIDDEN);
        res.json('Forbidden.');
        return next();
      }

      await oldEntity.update(newEntity, { override: true, upsert: true });
      let savedEntity = await NotificationDevice.findById(entity._id);
      savedEntity = omit(savedEntity.toObject(), 'userId');
    }

    res.status(httpStatus.CREATED);
    res.json(savedEntity);
  } catch (error) {
    next(error);
  }
};

/**
 * Get NotificationDevice
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await NotificationDevice.findById(req.params.id);

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
 * List NotificationDevice By userID
 * @public
 */
exports.listByUserId = async (req, res, next) => {
  try {
    let entities = await NotificationDevice.find({ createdBy: req.user._id });

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

/**
 * List NotificationDevice
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};

    let entities = await NotificationDevice.find(query);

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


/**
 * Update a existing NotificationDevice
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new NotificationDevice(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await NotificationDevice.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    if (req.user._id.toString() !== oldEntity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    let savedEntity = await NotificationDevice.findById(entity._id);
    savedEntity = omit(savedEntity.toObject(), 'userId');

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete NotificationDevice
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await NotificationDevice.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    if (req.user._id.toString() !== entity.userId.toString()) {
      res.status(httpStatus.FORBIDDEN);
      res.json('Forbidden.');
      return next();
    }

    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};

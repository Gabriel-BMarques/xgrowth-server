const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../model/user.model');
const Company = require('../../company-profile/model/companyProfile.model');
const Organization = require('../../organization/model/organization.model');
const mongoose = require('mongoose');
const UserAction = require('../model/userAction.model');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};


/**
 * List users by company
 * @public
 */
exports.listByCurrentUserCompany = async (req, res, next) => {
  try {
    const currentCompany = await Company.findById(req.user.company);
    const organizationCompanies = await Company.find({ organization: currentCompany.organization });
    const organizationCompaniesIds = organizationCompanies.map((company) => {
      return company._id;
    });
    const entities = await User.find({
        company: { $in: organizationCompaniesIds }
    });

    entities.sort((a, b) => {
      const nameA = a.email.toLowerCase(); 
      const nameB = b.email.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.listUsersByCompanyId = async (req, res, next) => {
  try {
    const entities = await User.find({ company: mongoose.Types.ObjectId(req.params.id) });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user);

/**
 * Get user by ID
 * @public
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const entity = await User.findOne({_id: req.user._id})
      .populate({ path: 'organization', 
        populate : {
        path: 'organizationType',
      }})
      .populate('company');

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    req.body = entity;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Verify if user email already exists
 * @public
 */
exports.verifyUserEmail = async (req, res, next) => {
  try {
    const responseObject = {
      user: false,
    };
    const query = req.body.email.toLowerCase();
    const user = await User.findOne({ email: query });
    if (user) {
      responseObject.user = true;
    }

    res.status(httpStatus.OK);
    res.json(responseObject);
  } 
  catch(error) {
    return next(error);
  }
}


/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = async (req, res, next) => {
  try {
    res.json(req.user.transform());
  } catch(error) {
    return next(error);
  }
};

/**
 * Get logged in user company
 * @public
 */
exports.getUserCompany = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const entity = await Company.findOne({ _id: companyId }).populate(
      { path: "organization", model: "Organization", select: { name: 1, logo: 1 } }
    );
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
 * Get logged in user related companies
 * @public
 */
exports.getUserRelatedCompanies = async (req, res, next) => {
  try {
    const relatedCompaniesQuery = await userService.getUserRelatedCompaniesQuery(req);
    const relatedCompanies = await Company.find(relatedCompaniesQuery).populate(
      { path: "organization", select: { name: 1 } }
    );

    if (!relatedCompanies) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }
    res.status(httpStatus.OK);
    res.json(relatedCompanies);
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update logged user
 * @public 
 */
exports.updateLoggedUser = async (req, res, next) => {
  try {
    let newEntity = req.body;
    const oldEntity = await User.findById(newEntity._id);

    if (newEntity.oldPassword) {
      const match = await bcrypt.compare(newEntity.oldPassword, oldEntity.password);
      if (!match) {
        res.status(httpStatus.EXPECTATION_FAILED);
        res.json('ERROR: Old password does not match with youre current password');
        return next();
      }
    }

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: There is no corresponding entity to update.');
    }
    const updatedUser = Object.assign(oldEntity, newEntity);
    await updatedUser.save();
    res.status(httpStatus.OK);
    res.json(updatedUser);
  } catch (error) {
    return next(error);
  }
}

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const oldUser = await User.findById(req.params.userId);
    const ommitRole = oldUser.role !== 'admin' ? 'role' : '';
    const updatedUser = omit(req.body, ommitRole);
    const user = Object.assign(oldUser, updatedUser);

    user.save()
      .then(savedUser => res.json(savedUser.transform()));
  } catch (error) {
    return next(User.checkDuplicateEmail(e));
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    const users = await User.find(query);
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    return next(error);
  }
};

/**
 * List all users
 * @public
 */
exports.listAll = async (req, res, next) => {
  try {
    const query = req.query || {};
    const users = await User.find(query)
      .populate('company');
    // Transforming users is a security measure to prevent hashes and sensible info to be displayed.
    // const transformedUsers = users.map(user => user.transform());
     users.sort((a, b) => {
      const nameA = a.email.toLowerCase(); 
      const nameB = b.email.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });
    res.json(users);
  } catch (error) {
    return next(error);
  }
};

/**
 * Create new user action
 * @public
 */
exports.createUserAction = async (req, res, next) => {
  try {
    const userAction = new UserAction(req.body);
    userAction.UserId = req.user._id;
    userAction.CompanyId = req.user.company;
    const savedUserAction = await userAction.save();
    res.status(httpStatus.CREATED);
    res.json(savedUserAction);
  } catch (error) {
    return next(error)
  }
};

/**
 * Create many user actions
 * @public
 */
 exports.createManyUserActions = async (req, res, next) => {
  try {
    console.log(req.body);
    let userActions = req.body.map((ua) => {
      ua.UserId = req.user._id;
      ua.CompanyId = req.user.company;
      return new UserAction(ua)
    });
    const savedUserActions = await UserAction.insertMany(userActions);
    res.status(httpStatus.CREATED);
    res.json(savedUserActions);
  } catch (error) {
    return next(error)
  }
};

/**
 * Update existing user action
 * @public
 */
exports.updateUserAction = async (req, res, next) => {
  try {
    const entity = new UserAction(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await UserAction.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await UserAction.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user actions list
 * @public
 */
exports.listUserActions = async (req, res, next) => {
  try {
    let query = {};

    if (req.query.text) {
      query = { $text: { $search: req.query.text } };
    } else {
      query = req.query;
    }

    let entities = await UserAction.find(query);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

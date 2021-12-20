const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../../shared/utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../../config/vars');
const Organization = require('../../organization/model/organization.model');

/**
 * User Roles
 */
const allowedRegistrationRoles = ['user', 'buyer', 'manager', 'contract manufacturer'];
const roles = ['user', 'admin', 'buyer', 'manager', 'contract manufacturer', 'organization-admin'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    _id_XG: {
      type: String,
    },
    NormalizedEmail: {
      type: String,
      match: /^\S+@\S+$/,
      required: false,
      unique: true,
      trim: true,
      lowercase: false,
    },
    email: {
      type: String,
      match: /^\S+@\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 128,
    },
    firstName: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    familyName: {
      type: String,
    },
    services: {
      facebook: String,
      google: String,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    selectedPlan: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    businessUnit: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessUnit',
      },
    ],
    departmentCode: {
      type: Number,
      ref: 'Department',
    },
    jobTitleCode: {
      type: Number,
      ref: 'JobTitle',
    },
    department: {
      type: String,
      required: false,
    },
    jobTitle: {
      type: String,
      required: false,
    },
    hasSeenTutorial: {
      type: Boolean,
      default: false,
    },
    hasSeenInterestsTutorial: {
      type: Boolean,
      default: false,
    },
    unnormalizedJobTitle: {
      type: String,
    },
    unnormalizedDepartment: {
      type: String,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Footprint',
    },
    picture: {
      type: String,
      trim: true,
    },
    resetDate: {
      type: Date,
    },
    Global: {
      type: Boolean,
    },
    activated: {
      type: Boolean,
      default: false,
    },
    activationKey: {
      type: String,
      maxlength: 20,
    },
    reactivated: {
      type: Boolean,
      default: false,
    },
    reactivationKey: {
      type: String,
      maxlength: 20,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    interestsStepCompleted: {
      type: Boolean,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    categoriesOrganization: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryOrganization',
        required: false,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

userSchema.virtual('canEditOrganization').get(() => {
  return true;
});

userSchema.pre('save', async function save(next, res) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.pre('update', async function save(next) {
  try {
    this.findOne({ _id: this._conditions._id }, async function newPassword(err, doc) {
      const rounds = env === 'test' ? 1 : 10;
      if (doc.password !== this.getUpdate().$set.password) {
        const hash = await bcrypt.hash(this.getUpdate().$set.password, rounds);
        this.getUpdate().$set.password = hash;
      }
      return next();
    });
  } catch (error) {
    return next(error);
  }
});

userSchema.post('findOne', async function (result, next) {
  try {
    if (result && typeof result?.organization === 'object') {
      result.organization.isComplete = await Organization.schema.methods.profileComplete(result.organization);
    }
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'id',
      'firstName',
      'familyName',
      'company',
      'reactivated',
      'activated',
      'email',
      'picture',
      'country',
      'jobTitle',
      'department',
      'hasSeenTutorial',
      'hasSeenInterestsTutorial',
      'role',
      'Global',
      'profileComplete',
      'blockedUser',
      'interestsStepCompleted',
      'createdAt',
      'organization',
      'canRespondBrief',
      'canEditOrganization',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {
  roles,
  allowedRegistrationRoles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const normalizedEmailUpper = options.email.toUpperCase();
    const normalizedEmailLower = options.email.toLowerCase();
    const { email, password, refreshObject, impersonation } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({
      $or: [{ email: normalizedEmailLower }, { NormalizedEmail: normalizedEmailUpper }],
    }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (impersonation) {
      return { user, accessToken: user.token() };
    }

    if (!user || user.blockedUser || (user.profileComplete && !user.activated)) {
      err.message = 'Incorrect email or password';
      throw new APIError(err);
    }

    if (password) {
      if (await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndSAML(userEmail) {
    const email = userEmail;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email: email.toString() });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    if (!user) {
      return { user: undefined, accessToken: undefined, activated: undefined };
    } else if (user.blockedUser) {
      err.message = 'Incorrect email';
      throw new APIError(err);
    }
    return { user, accessToken: user.token(), activated: user.activated };
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ page = 1, perPage = 30, name, email, role }) {
    const options = omitBy({ name, email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * List all users in descending order of 'createdAt' timestamp.
   *
   * @returns {Promise<User[]>}
   */
  listAll() {
    const options = omitBy(isNil);
    return this.find(options).sort({ createdAt: -1 }).exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [
          {
            field: 'email',
            location: 'body',
            messages: ['"email" already exists'],
          },
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

  async oAuthLogin({ service, id, email, name, picture }) {
    const user = await this.findOne({
      $or: [
        {
          [`services.${service}`]: id,
        },
        { email },
      ],
    });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: {
        [service]: id,
      },
      email,
      password,
      name,
      picture,
    });
  },

  async generatePassword(newPassword) {
    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(newPassword, rounds);
    return hash;
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);

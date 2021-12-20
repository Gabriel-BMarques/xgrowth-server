const httpStatus = require('http-status');
const User = require('../../user/model/user.model');
const Organization = require('../../organization/model/organization.model');
const RefreshToken = require('../../shared/models/refreshToken.model');
const moment = require('moment-timezone');
const mailService = require('../../shared/services/mailService');
const generate = require('nanoid/generate');
const { jwtExpirationInterval } = require('../../../config/vars');
const vars = require('../../../config/vars');
const JobTitle = require('../../user/model/jobTitle.model');
const Department = require('../../user/model/department.model');
const Country = require('../../shared/models/country.model');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// WOOPRA CODE BELOW
const Woopra = require('woopra');

const options = { ssl: true };

// The first argument in the constructor is your projectKey
// options is an object, currently the only option supported is ssl: <true|false> (default: true)
const woopra = new Woopra('xgrowth.growinco.com', options);

woopra.config({
  ssl: true,
});

function startWoopra(user) {
  woopra
    .identify({
      email: user.email,
      id: user.email,
      name: `${user.firstName} ${user.familyName}`,
      firstName: user.firstName,
      familyName: user.familyName,
      company: user.company?.companyName,
      department: user.department,
      jobTitle: user.jobTitle,
    })
    .push();
}

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken, impersonation) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user, impersonation).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

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
 * Returns user if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const { body } = req;

    const regex = `${body.email.split('@')[1]}`;

    const organizationDomain = {
      $or: [{ domain: { $regex: new RegExp(regex) } }, { allowedDomains: { $in: [regex] } }],
    };

    const existingOrganization = await Organization.findOne(organizationDomain);

    if (existingOrganization) {
      body.organization = existingOrganization;
    }

    const key = await generate(alphabet, 20);

    body.activationKey = key;
    body.role = 'user';
    body.interestsStepCompleted = false;
    body.NormalizedEmail = body.email.trim().toUpperCase();

    const user = await new User(body).save();
    const userTransformed = user.transform();

    mailService.sendAccountActivationMessage(user.email, key);

    res.status(httpStatus.CREATED);
    return res.json({ user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns user if creation was successful
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const { body } = req;

    const query = { $regex: `(?i)${body.email}` };
    const existingUser = await User.findOne({ email: query });
    let passKey = '';

    if (existingUser) {
      res.status(httpStatus.FORBIDDEN);
      return res.json({
        message: 'ERROR: This e-mail is already registered.',
      });
    }

    const key = await generate(alphabet, 20);
    body.activationKey = key;
    body.NormalizedEmail = body.email?.trim().toUpperCase();

    const roles = User.allowedRegistrationRoles;

    if (!roles.includes(body.role)) {
      body.role = 'admin';
    }

    if (!body.password) {
      passKey = generate(alphabet, 12);
      body.password = passKey;
      body.activated = true;
    }

    const user = await new User(body).save();
    const userTransformed = user.transform();

    mailService.sendNewUserMessage(user.firstName, user.familyName, user.email, passKey);

    res.status(httpStatus.CREATED);
    return res.json({ user: userTransformed });
  } catch (error) {
    console.log(error);
    return next(User.checkDuplicateEmail(error));
  }
};

// SSO methods BEGIN
/**
 * Returns user if registration was successful
 * @public
 */
const registerSAML = async (samlData) => {
  try {
    const regex = `${samlData.userEmail.split('@')[1]}`;
    const organizationDomain = {
      allowedDomains: { $regex: new RegExp(regex) },
    };
    const countryRegex = { $regex: new RegExp(`${samlData.country}`) };
    const jobTitleRegex = { $regex: new RegExp(`${samlData.jobTitle}`) };
    const departmentRegex = { $regex: new RegExp(`${samlData.department}`) };
    const existingOrganization = await Organization.findOne(organizationDomain);

    const country = await Country.findOne({
      $or: [{ name: countryRegex }],
    });
    const jobTitle = await JobTitle.findOne({
      $or: [{ name: jobTitleRegex }, { otherValues: jobTitleRegex }],
    });
    const department = await Department.findOne({
      $or: [{ name: departmentRegex }, { otherValues: departmentRegex }],
    });

    const key = await generate(alphabet, 20);
    let newUser = new User({
      firstName: samlData.firstName?.toString(),
      familyName: samlData.familyName?.toString(),
      email: samlData.userEmail.toString().toLowerCase(),
      role: 'user',
      activationKey: key,
      activated: true,
      jobTitle: jobTitle?.name,
      department: department?.name,
      country: country?._id,
      unnormalizedJobTitle: `${samlData.jobTitle}`,
      unnormalizedDepartment: `${samlData.department}`,
    });

    if (existingOrganization) {
      newUser.organization = existingOrganization;
    }

    newUser = await newUser
      .save()
      .then()
      .catch((err) => console.log('this might be your answer: ', err));

    mailService.newUserEmail(samlData.userEmail);

    return newUser;
  } catch (error) {
    console.log(error);
    return;
  }
};

/**
 * Returns jwt token if authenticated by SAML
 * @public
 */
exports.loginSAML = async (samlData) => {
  try {
    const { user, accessToken, activated } = await User.findAndSAML(samlData.userEmail);
    if (!user) {
      await registerSAML(samlData);
      // eslint-disable-next-line no-shadow
      const { user, accessToken, activated } = await User.findAndSAML(samlData.userEmail);
      if (user && accessToken && activated) {
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return { token, user: userTransformed };
      }
    } else if (user && accessToken && activated) {
      const token = generateTokenResponse(user, accessToken);
      const userTransformed = user.transform();
      return { token, user: userTransformed };
    }
    if (!user.activated) {
      activateSAML(user);
      const token = generateTokenResponse(user, accessToken);
      const userTransformed = user.transform();
      return { token, user: userTransformed };
    }
  } catch (error) {
    return error;
  }
};

/**
 * Returns activation status if successfully activaded
 * @public
 */
const activateSAML = async (user) => {
  // eslint-disable-next-line no-param-reassign
  user.activated = true;
  await user.save();
};
// SSO methods END

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    let status;
    const normalizedEmailUpper = req.body.email.toUpperCase();
    const normalizedEmailLower = req.body.email.toLowerCase();

    // Checking for previous registered users trying to login
    const registeredUser = await User.findOne({
      $or: [{ email: normalizedEmailLower }, { NormalizedEmail: normalizedEmailUpper }],
    });

    const registeredUserTransformed = registeredUser.transform();

    if ((registeredUser && registeredUser.blocked) || (registeredUser.profileComplete && !registeredUser.activated)) {
      if (!registeredUser.activated) {
        status = {
          status: 409,
          message: 'Please activate your account by email.',
        };
        return res.json({
          token: { accessToken: null },
          status,
          user: registeredUserTransformed,
        });
      } else {
        res.status(httpStatus.UNAUTHORIZED);
        return next(res.status);
      }
    }
    if (registeredUser && !registeredUser.password) {
      if (registeredUser.reactivationKey) {
        status = {
          status: 407,
          message: 'Reactivation key already sent',
        };
        return res.json({
          token: { accessToken: null },
          status,
          user: registeredUserTransformed,
        });
      }
      const key = await generate(alphabet, 20);
      registeredUser.reactivationKey = key;
      registeredUser.role = 'user';
      registeredUser.activated = true;
      registeredUser.reactivated = false;
      if (registeredUser.ClientInterestCompleted === false) {
        registeredUser.profileComplete = false;
      } else {
        registeredUser.profileComplete = true;
      }
      await User(registeredUser).save();
      mailService.sendAccountReactivationMessage(registeredUser.email, key);
      status = {
        status: 408,
        message: 'Your user need to be reactivated',
      };
      return res.json({
        token: { accessToken: null },
        status,
        user: registeredUserTransformed,
      });
    }

    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    if (process.env.NODE_ENV === 'production') startWoopra(user);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns jwt token if req user is admin
 * @public
 */
exports.impersonate = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken, true);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns activation status if successfully activaded
 * @public
 */
exports.activate = async (req, res, next) => {
  try {
    const { query } = req;
    query.activated = false;

    let user = await User.findOne(query);

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Invalid activation key' });
    }

    user.activated = true;
    user = await user.save();

    const userTransformed = user.transform();
    return res.json({ user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns reactivation status if successfully reactivated
 * @public
 */
exports.reactivate = async (req, res, next) => {
  try {
    const { query } = req;
    query.reactivated = false;

    const user = await User.findOne(query);

    if (!user) {
      res.status(httpStatus.NOT_FOUND);
      return res.json({ message: 'Invalid reactivation key' });
    }

    const userTransformed = user.transform();
    return res.json({ user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Check email and send reset password link
 * @public
 */
exports.resetPasswordInit = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(httpStatus.NO_CONTENT);
      res.end();
      return;
    }

    const key = generate(alphabet, 12);
    const newPassword = await User.generatePassword(key);

    // eslint-disable-next-line max-len
    await User.updateOne({ _id: user._id }, { $set: { password: newPassword, resetDate: Date.now() } });

    mailService.sendResetPasswordMail(user.email, key);

    res.status(httpStatus.NO_CONTENT);
    return res.json();
  } catch (error) {
    return next(error);
  }
};

/**
 * Check email and send reset password link
 * @public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email.toString();
    const user = await User.findOne({ email });
    const key = await generate(alphabet, 20);
    user.reactivationKey = key;
    user.reactivated = false;
    if (!user) {
      res.status(httpStatus.NO_CONTENT);
      res.end();
      return;
    }
    await User(user).save();
    mailService.sendForgottenPasswordMessage(user.email, key);

    res.status(httpStatus.NO_CONTENT);
    return res.json();
  } catch (error) {
    return next(error);
  }
};

/**
 * get reactivation password reset link
 * @public
 */
exports.getReactLink = async (req, res, next) => {
  try {
    const email = req.body.email.toString();
    const user = await User.findOne({ email });
    if (!user) {
      res.status(httpStatus.NO_CONTENT);
      res.end();
      return;
    }
    const key = generate(alphabet, 20);
    user.reactivationKey = key;
    user.reactivated = false;
    user.activated = true;
    await user.save();

    res.status(httpStatus.OK);
    res.json(`${vars.CLIENT_BASE_URL}/#/reactivate?reactivationKey=${key}`);
  } catch (error) {
    return next(error);
  }
};

/**
 * Change password based on user input
 * @public
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { userId } = req.body.id;
    const user = await User.findOne({ userId });

    if (!user) {
      res.status(httpStatus.NO_CONTENT);
      res.end();
      return;
    }

    const newPassword = req.body.password;
    await User.generatePassword(newPassword);

    // eslint-disable-next-line max-len
    await User.updateOne({ _id: user._id }, { $set: { password: newPassword, resetDate: Date.now() } });

    res.status(httpStatus.NO_CONTENT);
    return res.json();
  } catch (error) {
    return next(error);
  }
};

/**
 * Verify If domain already exists
 * @public
 */
exports.verifyDomain = async (req, res, next) => {
  try {
    const { body } = req;

    const responseObject = {
      domain: false,
    };

    const regex = `${body.email.split('@')[1]}`;

    const organizationDomain = {
      $or: [{ domain: { $regex: new RegExp(regex) } }, { allowedDomains: { $in: [regex] } }],
    };

    const existingOrganization = await Organization.findOne(organizationDomain);

    if (existingOrganization) {
      responseObject.domain = true;
    }

    res.status(httpStatus.OK);
    res.json(responseObject);
  } catch (error) {
    return next(error);
  }
};

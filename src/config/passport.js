const JwtStrategy = require('passport-jwt').Strategy;
const BearerStrategy = require('passport-http-bearer');
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
const authProviders = require('../api/authentication/service/authProviders');
const User = require('../api/user/model/user.model');
const fs = require('fs');
const SamlStrategy = require('passport-saml').Strategy;

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const oAuth = (service) => async (token, done) => {
  try {
    const userData = await authProviders[service](token);
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const saml = async (profile, done) => {
  try {
    const user = await User.findOne({ email: profile.email }, (err) => {
      if (err) {
        return done(err);
      }
    });
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

exports.jwt = new JwtStrategy(jwtOptions, jwt);

// CONFIG SAML MDLZ
exports.saml = new SamlStrategy(
  {
    path: '/api/saml/auth',
    entryPoint: 'https://login.microsoftonline.com/ad51dc96-9088-4b9e-9d7d-85b6f1a8c499/saml2',
    issuer: 'https://xgrowth-server-prod.azurewebsites.net',
    cert: fs.readFileSync('./src/cert/XGrowth.cer', 'utf8'),
  },
  saml
);
// CONFIG SAML GROWINCO
/* exports.saml = new SamlStrategy({
  path: '/growinco-api/saml/auth',
  entryPoint: 'https://login.microsoftonline.com/ad51dc96-9088-4b9e-9d7d-85b6f1a8c499/saml2',
  issuer: 'https://growinco.com',
  cert: fs.readFileSync('./src/cert/GrowinCo..cer', 'utf8'),
  // cert: fs.readFileSync('./src/cert/Welever.Growinco.cer', 'utf8'),
}, saml); */

exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));

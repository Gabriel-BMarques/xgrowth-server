var fs = require('fs');
var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var logoutProperties = {};
var userFrom;

var authController = require('../../authentication/controller/auth.controller');

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

exports.ensure_authenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else return res.redirect('/api/saml/login');
};

exports.send_saml_request = (req, res, next) => {
  if (req.query.userFrom) {
    userFrom = req.query.userFrom;
  }
  let idpDataPath;
  if (req.query.domain === 'mdlz.com') {
    idpDataPath = '/../saml-config/saml-config-mdlz.json';
  } else {
    idpDataPath = '/../saml-config/saml-config.json';
  }
  var fullUrl = 'https://' + req.get('host');
  var relayState = req.query.relayState;
  var rawIdpData = fs.readFileSync(__dirname + idpDataPath, 'utf8');
  // var rawIdpData = fs.readFileSync(__dirname + '/../saml-config/saml-config-mdlz.json', 'utf8');
  // var rawIdpData = fs.readFileSync(__dirname + '/../saml-config/saml-config.json', 'utf8');
  var idpData = JSON.parse(rawIdpData);

  passport.use(
    new SamlStrategy(
      {
        // URL that goes from the Identity Provider -> Service Provider
        callbackUrl: fullUrl + '/api/saml/auth',
        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: idpData.samlUrl,
        // Usually specified as `/shibboleth` from site root
        issuer: fullUrl,
        identifierFormat: null,
        // Service Provider private key
        decryptionPvk: fs.readFileSync(__dirname + '/../../cert/key.pem', 'utf8'),
        // Service Provider Certificate
        privateCert: fs.readFileSync(__dirname + '/../../cert/key.pem', 'utf8'),
        // Identity Provider's public key
        cert: idpData.certXGrowth,
        validateInResponseTo: false,
        disableRequestedAuthnContext: true,
        logoutUrl: idpData.samlLogoutUrl,
        logoutCallbackUrl: fullUrl + '/api/saml/logout',
        additionalParams: { RelayState: relayState ? relayState : fullUrl },
      },
      function (profile, done) {
        logoutProperties.nameID = profile.nameID;
        logoutProperties.nameIDFormat = profile.nameIDFormat;
        logoutProperties.sessionIndex = profile.sessionIndex;
        return done(null, profile);
      }
    )
  );
  res.redirect('/api/saml/login');
};

exports.receive_saml_reponse = async (req, res, next) => {
  if (req.body.RelayState == 'testconfig') {
    res.send('<pre>' + JSON.stringify(req.user, null, '\t') + '</pre>');
  } else {
    const email = req.user.nameID;
    const firstName = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
    const familyName = req.user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
    const jobTitle = req.user.JobTitle;
    const department = req.user.department;
    const country = req.user.country;

    const samlData = { userEmail: email, firstName, familyName, jobTitle, department, country };

    const responseObject = await authController.loginSAML(samlData);
    let redirectUrl;
    if (!responseObject || responseObject === undefined || !responseObject.token) {
      redirectUrl = `https://xgrowth.growinco.com/#/complete-register?email=${email}&firstName=${firstName}&familyName=${familyName}&jobTitle=${jobTitle}&department=${department}&country=${country}`;
    } else {
      const token = responseObject.token.accessToken;
      redirectUrl = `https://xgrowth.growinco.com/#/login?token=${token}&email=${email}&firstName=${firstName}&familyName=${familyName}&jobTitle=${jobTitle}&department=${department}&country=${country}`;
    }
    const links = `
      <div>
      Click <a href="${redirectUrl}">here
      </a> if you are not redirected automatically.
      </div>
      `;
    res.send(`
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="refresh" content="0;URL=${redirectUrl}">
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700"
            rel="stylesheet"
          />
          <title>Redirecting to XGrowth...</title>
          <style>
            * {
              font-family: 'Open sans'
            }
          </style>
        </head>
        <body>
          <div>
            Redirecting to XGrowth...
          </div>
          ${links}
        </body>
      </html>
    `);
  }
  userFrom = undefined;
};

exports.show_sp_metadata = function (req, res) {
  res.type('application/xml');
  var fullUrl = req.protocol + '://' + req.get('host');
  var samlStrategy = new SamlStrategy(
    {
      callbackUrl: fullUrl + '/api/saml/auth',
      issuer: fullUrl,
      identifierFormat: null,
      decryptionPvk: fs.readFileSync(__dirname + '/../cert/key.pem', 'utf8'),
      // Service Provider Certificate
      privateCert: fs.readFileSync(__dirname + '/../cert/key.pem', 'utf8'),
      validateInResponseTo: false,
      disableRequestedAuthnContext: true,
      logoutCallbackUrl: fullUrl + '/api/saml/logout',
    },
    function (profile, done) {
      return done(null, profile);
    }
  );
  res
    .status(200)
    .send(
      samlStrategy.generateServiceProviderMetadata(
        fs.readFileSync(__dirname + '/../cert/key.pem', 'utf8'),
        fs.readFileSync(__dirname + '/../cert/cert.pem', 'utf8')
      )
    );
};

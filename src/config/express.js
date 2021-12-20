const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const routes = require('../api/shared/routes/v2');
const { logs } = require('./vars');
const strategies = require('./passport');
const error = require('../api/shared/middlewares/error');
const _ = require('lodash');
const { authorizeRequest } = require('../api/shared/middlewares/requestAuthorizer');
const miniorangeSAML = require('../api/shared/routes/miniorange-saml');

/**
 * Express instance
 * @public
 */
const app = express();
// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('saml', strategies.saml);

// mount api v2 routes
app.use('/api/v2', authorizeRequest, routes);
app.use('/api/saml', miniorangeSAML);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
// app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

process.on('SIGINT', function () {
  process.exit(1);
});

module.exports = app;

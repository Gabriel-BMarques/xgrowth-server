var express = require("express");
var router = express.Router();
var samlController = require("../samlControllers/samlController");
var passport = require("passport");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: true });

/** Send Request to Haka for entity ID */
router.get("/", urlencodedParser, function (req, res, next) {
  var instruction =
    "<h3>Routes:</h3>" +
    "<ul><li> All routes start with /saml.</li>" +
    "<li>/saml/sp-metadata: This will generate your sp metadata file which can be provided to IDP</li>" +
    "<li>/saml/auth :  This route can be used to perform SAML SSO directly. Use url &ltbase&gt/saml/auth to perform SSO. To see the attributes returned by IDP which can be used for attribute mapping first name, last name and email use url &ltbase&gt/saml/auth?relayState=testconfig.</li>";
  res.send(instruction);
});

/** Form SAML Strategy */
router.get("/auth", urlencodedParser, samlController.send_saml_request);

/** Read SAML Response and Authenticate*/
router.post(
  "/auth",
  urlencodedParser,
  passport.authenticate("saml", { failureRedirect: "/saml/fail" }),
  samlController.receive_saml_reponse
);

router.get("/login", urlencodedParser, function (req, res, next) {
  passport.authenticate("saml", {
    failureRedirect: "/saml/fail",
  })(req, res, next); // <- just remember to add these
});

router.get("/fail", urlencodedParser, function (req, res) {
  res.status(401).send("Login failed");
});

router.get("/sp-metadata", urlencodedParser, samlController.show_sp_metadata);

module.exports = router;

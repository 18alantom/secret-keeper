const express = require("express");

const Secret = require("../database/model");
const { errorLogger, ensureAuthenticated } = require("../utils/utils");
const router = express.Router();
const stitch = require("../utils/stitch");

router.get("/", ensureAuthenticated, (req, res) => {
  Secret.find()
    .then(secrets => {
      let stringOfSecrets = stitch(secrets);
      res.render("secret", { loggedin: true, isSecret: true, secrets: stringOfSecrets });
    })
    .catch(error => {
      errorLogger(error);
      res.render("secret", { loggedin: true, isSecret: true });
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../utils/utils");

router.get("/", ensureAuthenticated, (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;

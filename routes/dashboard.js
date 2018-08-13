const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../utils/utils");

router.get("/", ensureAuthenticated, (req, res) => {
  const { username, secret, age } = req.user;
  res.render("dashboard", { username, secret, age, loggedin: true });
});
module.exports = router;

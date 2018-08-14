const express = require("express");
const passport = require("passport");

const router = express.Router();

// get: send login page.
router.get("/", (req, res) => {
  res.render("login");
});

// post: redirect to /dashboard if correct credentials else back to /login with flash message.
router.post("/", passport.authenticate("local", { failureRedirect: "/login", failureFlash: "incorrect credientials" }), (req, res) => {
  const { secret, age } = req.user;
  res.redirect("/dashboard");
});

module.exports = router;

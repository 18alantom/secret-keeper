const express = require("express");
const passport = require("passport");

const router = express.Router();

// get: send login page.
router.get("/", (req, res) => {
  res.render("login");
});

// post: redirect to /dashboard if correct credentials else back to /login with flash message.
router.post("/", passport.authenticate("local", { failureRedirect: "/login", failureFlash: "your spelt your name or password incorrectly" }), (req, res) => {
  console.log(req.user, req.body.username, req.flash("success"));
  const { secret, age } = req.user;
  console.log(req.body.username, secret, age);
  res.redirect("/dashboard");
});

module.exports = router;

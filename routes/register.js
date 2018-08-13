const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");

const Secret = require("../database/model");
const { errorLogger } = require("../utils/utils");

const router = express.Router();

// get: send register page.
router.get("/", (req, res) => {
  res.render("register");
});

// DONE: send flash message if passwords dont match,
// if username exists, if fields arent entered (remove required pop up)
// when user created redirect to login page with flash message showing
// secret added

// if any errors send back to register else to login
// post: check if form fields valid and send back accordingly.
router.post(
  "/",
  [
    // check the various parameters for validity if not generate an appropriate message
    check("username")
      .not()
      .isEmpty()
      .withMessage("what's your name?")
      .custom(username => {
        return Secret.findOne({ username }).then(secret => {
          if (secret) {
            return Promise.reject("identity conflict");
          }
        });
      }),
    check("password")
      .not()
      .isEmpty()
      .withMessage("you need to enter the password")
      .custom(value => value.length > 5)
      .withMessage("a longer password please")
      .custom(value => value.match(/\d/))
      .withMessage("a digit in the password atleast"),
    check("rpassword")
      .not()
      .isEmpty()
      .withMessage("confirm your password please")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("are you sure the passwords match?"),
    check("age")
      .not()
      .isEmpty()
      .withMessage("how old are you?")
      .custom(value => value > 17)
      .withMessage("you are far too young"),
    check("secret")
      .not()
      .isEmpty()
      .withMessage("what's your secret?")
  ],
  (req, res) => {
    const { username, password, age, secret } = req.body;
    const errors = validationResult(req).array();
    if (!errors.length) {
      // protect password by hashing.
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        errorLogger(err);
        Secret.create({ username, password: hashedPassword, age, secret })
          .then(secret => {
            res.status(201);
            req.flash("suc", "your secret has been added");
            res.redirect("/login");
          })
          .catch(e => {
            errorLogger(e);
            res.status(500);
            req.flash("err", "something went wrong");
            res.render("register");
          });
      });
    } else {
      res.status(400);
      req.flash("err", errors[0].msg);
      res.render("register");
    }
  }
);

module.exports = router;

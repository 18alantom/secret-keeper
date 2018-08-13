const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Secret = require("../database/model");
const { errorLogger } = require("../utils/utils");

const auth = app => {
  app.use(passport.initialize());
  app.use(passport.session());
  // converts saves a unique user id as a cookie with the user
  passport.serializeUser((secret, done) => {
    done(null, secret.id);
  });
  // uses the saved cookie (id) to retrieve user session
  passport.deserializeUser((id, done) => {
    Secret.findById(id)
      .then(secret => {
        done(null, secret);
      })
      .catch(error => {
        errorLogger(error);
        done(error);
      });
  });
  // Use local strategy
  // if error done(error);
  // if valid done(null,secret);
  // if not valid done(null,false);
  passport.use(
    new LocalStrategy((username, password, done) => {
      // const hashed = crypto
      //   .createHash("sha256")
      //   .update(username)
      //   .digest("hex");
      Secret.findOne({ username })
        .then(secret => {
          if (!secret) {
            done(null, false, { message: "you spelt your name wrong" });
          } else {
            bcrypt.compare(password, secret.password).then(verdict => {
              if (!verdict) {
                done(null, false, { message: "the password should be correct" });
              } else {
                done(null, secret);
              }
            });
          }
        })
        .catch(error => {
          errorLogger(error);
          return done(error);
        });
    })
  );
};

module.exports = auth;

const errorLogger = (e, res) => {
  if (e) {
    const begin = "FROM ERROR LOGGER: \n";
    const end = "\nEND ERROR \n";
    console.error(begin, e, end);
    if (res) {
      res.status(500);
      res.send("something went wrong");
    }
  }
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("err", "you need to login first");
    res.redirect("/");
  }
};

module.exports = {
  errorLogger,
  ensureAuthenticated
};

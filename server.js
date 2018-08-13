require("dotenv").config(); // load .env into process.env
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
// authorizaion
const auth = require("./auth/auth");
// routes
const register = require("./routes/register");
const login = require("./routes/login");
const dashboard = require("./routes/dashboard");
const logout = require("./routes/logout");
const secret = require("./routes/secret");
//get db uri and port number from process.env
const { MONGODB_URI, PORT, SECRET } = process.env;
const app = express();
// connect to database
mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("connected to db"))
  .catch(e => console.error(e));

// Use existing mongoose connection to DB as session store
const store = new MongoStore({ mongooseConnection: mongoose.connection });

// set app properties
app.set("views", "./views");
app.set("view engine", "pug");
// set middlewares
app.use("/public", express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SECRET,
    resave: true,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 30 // 30 mins.
      // secure: true
    }
  })
);
auth(app);
app.use(flash());
// set routers for certain paths

app.use("/register", register);
app.use("/login", login);
app.use("/dashboard", dashboard);
app.use("/logout", logout);
app.use("/secret", secret);

// respond with template.pug file
// TODO: respond to all get paths with template.pug
app.get("/", (req, res) => {
  res.render("template", { loggedin: false });
});

// redirect to '/' if the the page doesn't exist.
app.use((req, res) => {
  res.status(404);
  req.flash("err", "you have chosen the wrong path");
  res.redirect("/");
});
// start server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

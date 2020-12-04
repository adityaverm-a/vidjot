
const express = require("express");
const _handlebars = require('handlebars')
const path = require("path");
const exphbs = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');

const app = express();

const ideas = require("./routes/ideas");
const users = require("./routes/users");

require('./config/passport')(passport);
const db = require('./config/database');

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json())

app.use(methodOverride("_method"));

mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected.....");
  })
  .catch(err => console.log(err));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(_handlebars)
}));

app.set('view engine', 'handlebars');

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next){

  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.get("/", function(req, res) {

  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.use("/ideas", ideas);
app.use("/users", users);

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Server has started on port 3000!");
});

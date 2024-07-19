var createError = require('http-errors');
const express = require('express');
var path = require('path');
const Handlebars = require('handlebars');
var session = require('express-session');
const mongoose = require('mongoose');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var exphbs = require('express-handlebars');
var app = express();

var fileUpload = require('express-fileupload');
var db = require('./config/connection');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var session = require('express-session');

// Register custom helpers before setting up the Handlebars engine
const handlebarsHelpers = {
  gt: (a, b) => a > b,
  eq: (a, b) => a === b,
  getFirstName: (name) => {
    if (!name) return '';
    return name.split(' ')[0];
  },
  formatDate: function(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  },
};

// Create the Handlebars instance with the custom helpers
const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views/layouts/'),
  partialsDir: path.join(__dirname, 'views/partials/'),
  helpers: handlebarsHelpers
});

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(session({ secret: "key", cookie: { maxAge: 6000000000 } }));
app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({ secret: "poda", resave: false, saveUninitialized: true }));
db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('DB connected successfully');
  }
});

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


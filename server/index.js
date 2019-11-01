'use strict'

const express = require('express');
const path = require('path')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db');
const PORT = process.env.PORT || 4000;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbStore = new SequelizeStore({ db: db });
const passport = require('passport');

const app = express();

// Passport registration
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await user.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Logging middleware
app.use(morgan('dev'));


// Session middleware with passport

// Sync so that session table is created
dbStore.sync();

app.use(session({
  secret: process.env.SESSION_SECRET || 'this is the secret',
  store: dbStore,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// static middleware
app.use(express.static(path.join(__dirname, '../public')));

// body parsing middleware
// I think could also use express.json, etc.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API (to include routes), and auth
app.use('/auth', require('./auth'));
app.use('/api', require('./api'));

// Send index.html for ay other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(error.status || 500).send(error.message || 'Internal server error')
});

// Start the server
db.sync() // { force: true }
  .then(() => {
    console.log('db synced')
    app.listen(PORT, function () {
      console.log('App listen function has run');
      console.log(`Server is listening on port ${PORT}`);
    });
  });

module.exports = app;

'use strict'

const express = require('express');
const path = require('path')
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// logging middleware
app.use(morgan('dev'));

// static middleware
app.use(express.static(path.join(__dirname, '../public')));

// body parsing middleware
// I think could also use express.json, etc.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API (to include routes)
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
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log('App listen functionhas run');
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;

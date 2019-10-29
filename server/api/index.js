'use strict'

const router = require('express').Router();

router.use('/exRoute', require('./exRoute'));

router.use((req, res, next) => {
  const error = new Error('The requested route cannot be found!');
  error.status = 404;
  next(error);
});

module.exports = router;

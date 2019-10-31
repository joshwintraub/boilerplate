const Sequelize = require('sequelize');
const db = require('../database');

const Model = db.define('model', {
  name: {
    type: Sequelize.STRING
  }
});

module.exports = Model;

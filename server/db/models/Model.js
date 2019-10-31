const Sequelize = require('sequelize');
const db = require('../database');

const Model = db.define('Model', {
  name: {
    type: Sequelize.STRING
  }
});

module.exports = Model;

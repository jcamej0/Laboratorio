'use strict';

let _ = require('lodash');
let {notFound} = require('./notFound.js');

module.exports = {
  getById
};

function getById(id, conditions) {
  return this.findOne(_.assign({}, {_id: id}, conditions || {}))
  .then(notFound.bind(this));
};

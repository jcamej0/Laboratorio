'use strict';

let Promise = require('bluebird');

let data =[
  {name: 'canino'},
  {name: 'felino'},
  {name: 'equino'}
];

module.exports = Promise.resolve({
  data,
  model: 'Species'
});

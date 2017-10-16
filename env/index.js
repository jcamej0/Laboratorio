'use strict';

let _ = require('lodash');
let env = process.env.ENV || 'develop';
let example = require('./example.json');
let vars;
try {
  vars = _.merge({}, example, require('./' + env + '.json'));
} catch (e) {
  if (isDevelop()){
    vars = example;
  }
}

module.exports = _.assign(vars, {
  env,
  isDevelop
});

function isDevelop() {
  return env === 'develop';
}

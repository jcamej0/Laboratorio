'use strict';

let _ = require('lodash');
let Mockaroo = require('mockaroo');
let {key} = require('../../env/').mock;

let client = new Mockaroo.Client({
  apiKey: key
});

let mockHelper = {
  mock,
  mockOne
};

module.exports = mockHelper;

function getCached(model, n, cache) {
  if (cache) {

    try {
      let data = require('./cached/' + model + '.json');

      return Promise.resolve(_.sampleSize(data, n));
    } catch (e) {}
  }

  return client.generate({
    count: n,
    schema: model
  });
}

function mock(model, mod, n = 10, cache = true) {
  return getCached(model, n, cache)
  .then(function modData(data) {
    let dataMod = getMod(model, mod);
    if (dataMod) {
      return _.map(data, dataMod);
    }
    return data;
  });
}

function mockOne(model, mod) {
  return mock(model, mod, 1)
  .then((data) => {
    if (_.isArray(data)) {
      return _.head(data);
    } else {
      return data;
    }
  });
}

function getMod(model, mod) {

  if (mod) {
    try {
      return require('./defs/'+ model + '.js')[mod];
    } catch (e){
      return;
    }
  }
}

'use strict';

let bluebird = require('bluebird');
let fs = bluebird.promisifyAll(require('fs'));
let _ = require('lodash');

let debug = require('debug')('seed');
let mongoose = require('../mongoose/');

let completed = [];

const seedFolder = __dirname + '/data/';

mongoose.then((mongoose) => {

  return seedModels(mongoose);
});

function seedModels(mongoose) {

  return fs.readdirAsync(seedFolder)
  .map(function getModels(file) {

    debug('seed model from file ' + file);

    return require(seedFolder + file)
    .then((seed) => {
      return seedModel(seed, mongoose);
    });
  }, {concurrency: 1})
  .then(() => process.exit());
}

function seedModel({data, ref, model}, mongoose) {

  if (_.includes(completed, model)) {
    return bluebird.resolve(true);
  }

  let Model = mongoose.model(model);

  return Model.remove({})
  .exec()
  .then(() => {
    if (ref) {
      return seedModel(ref, mongoose);
    }
  })
  .then(() => {
    let refData = data.map(function(data) {

      if (data.refs) {
        _.each(data.refs, (refs, index) => {
          data[index] = refs._id;
        });
      }
      return data;
    });
    return bluebird.map(refData, (data) => {
      let model = new Model(data);
      return model.create();
    }, {concurrency: 1});
  })
  .then((inserted) => {
    _.each(inserted, (doc, index) => {
      _.assign(data[index], doc.toObject());
    });

    completed.push(model);

    return inserted;
  });
}

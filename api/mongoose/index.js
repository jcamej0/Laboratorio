'use strict';

let bluebird = require('bluebird');
let fs = bluebird.promisifyAll(require('fs'));
let debug = require('debug')('mongo');
let mongoose = require('mongoose');

const modelFolder = '/../models/';
const {host, port, name} = require('../../env/').mongo;
const uri = 'mongodb://' + host + ':' + port + '/' + (process.env.MONGODB || name);

mongoose.Promise = require('bluebird');

module.exports = mongoose.connect(uri, {useMongoClient: true})
.then(() => {
  debug('Mongo connected on URI: ' + uri);
  return loadModels();
})
.then(() => mongoose)
.catch((e) => {
  debug(e);
  debug('Error connecting to mongo');
  process.exit();
});

function loadModels() {
  return fs.readdirAsync(__dirname + modelFolder)
  .map(function getModels(file){
    let model = require(__dirname + modelFolder + file);

    debug('load model ' + model.modelName + ' from ' + file + ' file');
  });
}

'use strict';

const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const refParser = require('json-schema-ref-parser');
const YAML = require('yamljs');
const debug = require('debug')('swagger-build');

const config = require('./env/');

let swaggerDir = __dirname + '/api/swagger';
let dataDir = __dirname + '/email/src/data';

[swaggerDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
});

module.exports = fs.writeFileAsync(
  __dirname + '/env/current.json',
  JSON.stringify(config, undefined, 2)
).then(function createEmailData() {
  return fs.writeFileAsync(
    __dirname + '/email/src/data/env.json',
    JSON.stringify(config.email, undefined, 2)
  );
})
.then(function createSwagger() {
  return refParser.dereference('./api/swagger.yaml');
})
.then(function (res) {

  return fs.writeFileAsync(
    __dirname + config.api.path,
    YAML.stringify(res, 100, 2)
  );
}, function handleError(e) {
  debug('Error building swagger file.');
  debug(e);
  throw 'Build fail';
});

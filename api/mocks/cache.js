'use strict';

let _ = require('lodash');
let fs = require('fs');

let mock = require('./index.js');
let {models} = require('../../env/').mock;
let folder = __dirname + '/cached';

function cached() {

  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }

  _.each(models, (model) => {
    mock.mock(model, null, 1000)
    .then((data) => {
      fs.writeFileSync(folder + '/' + model + '.json', JSON.stringify(data, undefined, 2));
    });
  });
}

module.exports = {
  cached
};

cached();

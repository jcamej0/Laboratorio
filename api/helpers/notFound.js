'use strict';
let _ = require('lodash');

module.exports = {
  notFound
};

function notFound(data) {
  if (data) {
    return data;
  } else {
    let e = new Error('Not found');

    _.extend(e, {
      code: 404,
      modelName: this.model.modelName
    });
    throw e;
  }
}

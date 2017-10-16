'use strict';

let mongoose = require('mongoose');
let User = mongoose.model('Users');

module.exports = {
  passwordCheck: passwordCheck,
  finalizeRecord: finalizeRecord,
  beforeCreateToken: beforeCreateToken
};

function passwordCheck(username, password, cb) {
  cb(null, username() && password());
}

function beforeCreateToken(parsedBody, options, next) {
  User.findOne({
    email: parsedBody.username
  }).then((user) => {
    if (user) {
      if (parsedBody.grant_type === 'password') {
        return user.checkPassword(parsedBody.password)
        .then((response) => {
          options.attributes = user.omit();
          return response;
        });
      } else {
        options.attributes = user.omit();
        return true;
      }
    } else {
      return false;
    }
  }).then((valid) => {
    function isValid() {
      return valid;
    }
    parsedBody.username = isValid;
    parsedBody.password = isValid;
    next();
  })
  .catch(next);
}

function finalizeRecord(req, res, record, cb) {
  record.finalized = true;
  cb(null, record);
}

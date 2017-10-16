'use strict';

let _ = require('lodash');
let bluebird = require('bluebird');
let bcrypt = bluebird.promisifyAll(require('bcrypt'));
let mongoose = require('mongoose');
let {Schema} = mongoose;
let {notFound} = require('../helpers/notFound');
let email = require('../../email/');
let {getById} = require('../helpers/findById');

let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'created', 'disable'],
    default: 'active'
  },
  password: {
    type: String,
    required: true
  },
  idNumber: {
    type: Number,
    required: true
  },
  idType: {
    type: String,
    enum: ['v', 'e', 'j'],
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  settings: {
    animations: {
      type: Boolean,
      default: true
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add methods
_.extend(UserSchema.methods, {
  omit,
  create,
  update,
  fullName,
  forceSave,
  setPassword,
  checkPassword,
  sendInviteEmail,
  sendPasswordChangeEmail
});

// Add query helpers
_.extend(UserSchema.query, {
  getById,
  findByEmail
});

// Schema Methods

function create() {

  return this.setPassword(this.password)
  .then(function getHash() {
    return this.save();
  });
}

function forceSave() {
  return this.save({validateBeforeSave: false});
}

function update(data) {

  // Only update this fields
  let filterData = _.pick(data, [
    'idNumber',
    'idType',
    'firstName',
    'lastName'
  ]);

  _.assign(this, filterData);

  return this.save();
}

function fullName() {
  return this.firstName + ' ' + this.lastName;
}

function sendInviteEmail(token) {
  let to = this.email;
  let from = 'support';
  let subject = 'Invite to Laboratoire';
  let template = 'invite';

  return email.sendEmail(template, from, to, subject, {
    token: encodeURIComponent(token.access_token),
    username: this.fullName(),
  });
}

function sendPasswordChangeEmail() {
  let to = this.email;
  let from = 'support';
  let subject = 'Password Change';
  let template = 'passwordChange';

  return email.sendEmail(template, from, to, subject, {
    username: this.fullName()
  });
}

function setPassword(password) {

  return bcrypt
  .hashAsync(password, 10)
  .bind(this)
  .then(function getHash(hash) {
    this.password = hash;
    return this;
  });
}

function omit() {
  this.password = undefined;
  return this;
}

function checkPassword(password) {
  return bcrypt.compareAsync(password, this.password);
}

// Query Helpers

function findByEmail(email) {
  return this
    .findOne({email: email})
    .exec()
    .then(notFound.bind(this));
}

module.exports = mongoose.model('Users', UserSchema);

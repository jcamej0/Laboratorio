'use strict';
let _ = require('lodash');
let mongoose = require('mongoose');
let {Schema} = mongoose;
let {getById} = require('../helpers/findById');

let ClientsSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  idNumber: {
    type: Number,
    required: true,
  },
  idType: {
    type: String,
    enum: ['v', 'e', 'p'],
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
  deleteAt: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: Number
  }
}, {
  timestamps: true
});

ClientsSchema.index({idNumber: 1, idType: 1}, {unique: true});

// Add methods
_.extend(ClientsSchema.methods, {
  update,
  deleteClient
});

// Add query helpers
_.extend(ClientsSchema.query, {
  getById
});

// Schema Methods
function update(data) {

  // Only update this fields
  let filterData = _.pick(data, [
    'idNumber',
    'idType',
    'firstName',
    'lastName',
    'email',
    'phoneNumber'
  ]);

  _.assign(this, filterData);

  return this.save();
}

function deleteClient() {
  this.deleteAt = new Date();
  return this.save();
}

module.exports = mongoose.model('Clients', ClientsSchema);

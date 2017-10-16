'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let {Schema} = mongoose;
let {getById} = require('../helpers/findById');

let SpeciesSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

_.extend(SpeciesSchema.methods, {
  create,
  update,
  deleteSpecie,
});

_.extend(SpeciesSchema.query, {
  getById,
});

function create() {
  return this.save();
}

function update(data) {
  let filterData = _.pick(data, [
    'name',
    'active'
  ]);

  _.assign(this, filterData);

  return this.save();
}

function deleteSpecie() {
  this.active = false;
  return this.save();
}

module.exports = mongoose.model('Species', SpeciesSchema);

'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let {Schema} = mongoose;
let {getById} = require('../helpers/findById');

let BreedsSchema = new Schema({
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
  },
  species: {
    type: Schema.Types.ObjectId,
    ref: 'Species'
  }
}, {
  timestamps: true
});

_.extend(BreedsSchema.methods, {
  create,
  update,
  deleteBreed,
});

_.extend(BreedsSchema.query, {
  getById,
});

function create() {
  return this.save();
}

function update(data) {
  let filterData = _.pick(data, [
    'name',
    'active',
    'species'
  ]);

  _.assign(this, filterData);

  return this.save();
}

function deleteBreed() {
  this.active = false;
  return this.save();
}

module.exports = mongoose.model('Breeds', BreedsSchema);

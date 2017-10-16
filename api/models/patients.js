'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let {Schema} = mongoose;
let {getById} = require('../helpers/findById');

let PatientsSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  birthDate: {
    type: Date,
    required: true
  },
  breed: {
    type: Schema.Types.ObjectId,
    ref: 'Breed'
  },
  deleteAt: {
    type: String,
    default: null,
  }
}, {
  timestamps: true
});

_.extend(PatientsSchema.methods, {
  update,
  deletePatient,
});

_.extend(PatientsSchema.query, {
  getById
});

function update(data) {
  let filterData = _.pick(data, [
    'name',
    'breed',
    'birthDate'
  ]);

  _.assign(this, filterData);

  return this.save();
}

function deletePatient() {
  this.deleteAt = new Date();
  return this.save();
}

module.exports = mongoose.model('Patients', PatientsSchema);

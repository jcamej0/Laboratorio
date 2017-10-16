'use strict';

let mongoose = require('mongoose');
let {Schema} = mongoose;

let ResultsSchema = new Schema({
  bioanalysis: {
    type: Schema.Types.ObjectId,
    ref: 'Bioanalysis',
    required: true
  },
  values: [{
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Results', ResultsSchema);

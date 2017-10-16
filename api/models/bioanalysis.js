'use strict';

let mongoose = require('mongoose');
let {Schema} = mongoose;

let BioanalysisSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bioanalysis', BioanalysisSchema);

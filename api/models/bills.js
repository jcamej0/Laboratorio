'use strict';

let mongoose = require('mongoose');
let {Schema} = mongoose;

let BillsSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Clients',
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'cancelled'],
    default: 'pending'
  },
  paymentInfo: [{
    number: {
      type: String
    },
    type: {
      idNumber: String,
      type: ['Credit Card', 'Debit Card', 'Cash', 'Transfer'],
      required: true
    },
    details: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  articles: [{
    item: {
      type: Schema.Types.ObjectId,
      ref: 'Bioanalysis',
      required: true
    },
    result: {
      type: Schema.Types.ObjectId,
      ref: 'Results'
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
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

module.exports = mongoose.model('Bills', BillsSchema);

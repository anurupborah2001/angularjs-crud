'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var CarSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: 'New Listing',
    trim: true,
    required: 'Title cannot be blank'
  },
  type: {
    type: String,
    default: 'used',
    trim: true,
    required: 'Type cannot be blank'
  },
  make: {
    type: String,
    default: '',
    trim: true,
    required: 'Make cannot be blank'
  },
  model: {
    type: String,
    default: '',
    trim: true,
    required: 'Model cannot be blank'
  },
  year: {
    type: String,
    default: '',
    trim: true
  },
  price : {
    type: String,
    default: '',
    trim: true,
     required: 'Price cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  imageurl: {
    type: String,
    default: '../thumb.png',
    trim: true,
    required : 'Image is required'
  },
  contact_email: {
    type: String,
    default: '',
    pattern : "^\\S+@\\S+$",
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Car', CarSchema);

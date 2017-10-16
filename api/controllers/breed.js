'use strict';

let mongoose = require('mongoose');
let {ObjectId} = mongoose.Types;
let errorHandler = require('../helpers/errorHandler.js').mongo;
let Breed = mongoose.model('Breeds');

module.exports = {
  createBreed,
  getAllBreeds,
  getBreed,
  modifyBreed,
  deleteBreed,
};

function createBreed(req, res, next) {
  let {body} = req;
  let breed = new Breed(body);

  breed
  .save()
  .then((newBreed) => {
    res.json(newBreed);
  })
  .catch((err) => errorHandler(err, res, next));
};

function getAllBreeds(req, res, next) {

  Breed
  .find({active: true})
  .exec()
  .then((breeds) => {
    res.json(breeds);
  })
  .catch((err) => {
    errorHandler(err, res, next);
  });
}

function getBreed(req, res, next) {
  let id = req.swagger.params.id.value;

  Breed
  .find()
  .getById(new ObjectId(id), {active: true})
  .then((reqBreed) => {
    res.json(reqBreed);
  })
  .catch((err) => errorHandler(err, res, next));
}

function modifyBreed(req, res, next) {
  let id = req.swagger.params.id.value;
  let {body} = req;

  Breed
  .find()
  .getById(new ObjectId(id), {active: true})
  .then((reqBreed) => {
    return reqBreed.update(body);
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

function deleteBreed(req, res, next) {
  let id = req.swagger.params.id.value;

  Breed
  .find()
  .getById(new ObjectId(id))
  .then((reqBreed) => {
    return reqBreed.deleteBreed();
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

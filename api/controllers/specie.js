'use strict';

let mongoose = require('mongoose');
let {ObjectId} = mongoose.Types;
let errorHandler = require('../helpers/errorHandler.js').mongo;
let Specie = mongoose.model('Species');

module.exports = {
  createSpecie,
  getAllSpecies,
  getSpecie,
  modifySpecie,
  deleteSpecie,
};

function createSpecie(req, res, next) {
  let {body} = req;
  let specie = new Specie(body);

  specie
  .save()
  .then((newSpecie) => {
    res.json(newSpecie);
  })
  .catch((err) => errorHandler(err, res, next));
};

function getAllSpecies(req, res, next) {

  Specie
  .find({active: true})
  .exec()
  .then((species) => {
    res.json(species);
  })
  .catch((err) => {
    errorHandler(err, res, next);
  });
}

function getSpecie(req, res, next) {
  let id = req.swagger.params.id.value;

  Specie
  .find()
  .getById(new ObjectId(id), {active: true})
  .then((reqSpecie) => {
    res.json(reqSpecie);
  })
  .catch((err) => errorHandler(err, res, next));
}

function modifySpecie(req, res, next) {
  let id = req.swagger.params.id.value;
  let {body} = req;

  Specie
  .find()
  .getById(new ObjectId(id), {active: true})
  .then((reqSpecie) => {
    return reqSpecie.update(body);
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

function deleteSpecie(req, res, next) {
  let id = req.swagger.params.id.value;

  Specie
  .find().getById(new ObjectId(id))
  .then((reqSpecie) => {
    return reqSpecie.deleteSpecie();
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

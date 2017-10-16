'use strict';

let mongoose = require('mongoose');
let {ObjectId} = mongoose.Types;
let errorHandler = require('../helpers/errorHandler.js').mongo;
let Patient = mongoose.model('Patients');

module.exports = {
  createPatient,
  getAllPatients,
  getPatient,
  modifyPatient,
  deletePatient,
};

function createPatient(req, res, next) {
  let {body} = req;
  let patient = new Patient(body);

  patient
  .save()
  .then((newPatient) => {
    res.json(newPatient);
  })
  .catch((err) => errorHandler(err, res, next));
};

function getAllPatients(req, res, next) {

  Patient
  .find({deleteAt: null})
  .exec()
  .then((patients) => {
    res.json(patients);
  })
  .catch((err) => {
    errorHandler(err, res, next);
  });
}

function getPatient(req, res, next) {
  let id = req.swagger.params.id.value;

  Patient
  .find()
  .getById(new ObjectId(id), {deleteAt: null})
  .then((reqPatient) => {
    res.json(reqPatient);
  })
  .catch((err) => errorHandler(err, res, next));
}

function modifyPatient(req, res, next) {
  let id = req.swagger.params.id.value;
  let {body} = req;

  Patient
  .find()
  .getById(new ObjectId(id), {deleteAt: null})
  .then((reqPatient) => {
    return reqPatient.update(body);
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

function deletePatient(req, res, next) {
  let id = req.swagger.params.id.value;

  Patient
  .find()
  .getById(new ObjectId(id), {deleteAt: null})
  .then((reqPatient) => {
    return reqPatient.deletePatient();
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

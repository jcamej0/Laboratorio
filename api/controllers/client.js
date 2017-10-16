'use strict';

let mongoose = require('mongoose');
let {ObjectId} = mongoose.Types;
let errorHandler = require('../helpers/errorHandler.js').mongo;
let Client = mongoose.model('Clients');

module.exports = {
  createClient,
  getAllClients,
  getClient,
  modifyClient,
  deleteClient,
};

function createClient(req, res, next) {
  let {body} = req;
  let client = new Client(body);

  client
  .save()
  .then((newClient) => {
    res.json(newClient);
  })
  .catch((err) => errorHandler(err, res, next));
};

function getAllClients(req, res, next) {

  Client
  .find({deleteAt: null})
  .exec()
  .then((clients) => {
    res.json(clients);
  })
  .catch((err) => {
    errorHandler(err, res, next);
  });
}

function getClient(req, res, next) {
  let id = req.swagger.params.id.value;
  Client
  .find()
  .getById(new ObjectId(id), {deleteAt: null})
  .then((reqClient) => {
    res.json(reqClient);
  })
  .catch((err) => errorHandler(err, res, next));
}

function modifyClient(req, res, next) {
  let id = req.swagger.params.id.value;
  let {body} = req;

  Client
  .find()
  .getById(new ObjectId(id), {deleteAt: null})
  .then((reqClient) => {
    return reqClient.update(body);
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

function deleteClient(req, res, next) {
  let id = req.swagger.params.id.value;

  Client
  .find()
  .getById(new ObjectId(id))
  .then((reqClient) => {
    return reqClient.deleteClient();
  })
  .then((successData) => {
    res.json(successData);
  })
  .catch((err) => errorHandler(err, res, next));
}

'use strict';

// User other mongo DB
process.env.MONGODB = 'cucumber-laboratoire';

let _ = require('lodash');
let app = require('../../../index.js');
let env = require('../../../env/');
let mock = require('../../../api/mocks/');
let request = require('supertest');
let {defineSupportCode} = require('cucumber');

const defaultHeader = {
  Accept: 'application/json'
};

function CustomWorld() {
  this.app = app;
  this.env = env;
  this.mock = mock;
  this.sendReq = sendReq;
  this.getId=getId;
  this.id='';
}

function sendReq(action, path, body, headers) {
  return this.app.then((server) => {
    return request(server)[action](env.api.basePath + path)
      .send(body || this.body)
      .set(_.assign({}, defaultHeader, headers || this.headers))
      .set('Authorization', 'Bearer ' + (this.request? this.request.body.access_token: ''));
  })
  .then((request) => {
    this.request = request;
    return request;
  });
}

function getId(data){
  this.id = data.body[Math.floor((Math.random() * data.body.length))]._id;
};

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(CustomWorld);
});

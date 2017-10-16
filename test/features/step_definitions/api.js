'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let debug = require('debug')('cucumber:steps');
let should = require('should');
let request = require('supertest');
let {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {

  Given('that I have a logged user', function () {
    return this.mock.mockOne('users')
    .then((user) => {
      return this.sendReq('post', '/users', user)
        .then((response) => {
          return this.sendReq('post', '/login', {
            username: user.email,
            password: user.password
          });
        })
        .then((request) => {
          this.token = request.body;
        });
    });
  });

  Given('that I have a register user', function (body) {
    return this.sendReq('post', '/users', JSON.parse(body));
  });

  Given('that i have a random "{arg1}"', function (path) {
    path += 's';
    return this.sendReq('get', '/'+path).then((req) => {
      return this.getId(req);
    });
  });

  Given('that I have a body', function (body) {
    this.body = JSON.parse(body);
  });

  Given('that I have clean "{arg1}" model', function (model) {
    return mongoose.model(model).remove({}).exec();
  });

  When('I {arg1} on "{arg2}"', function (method, path) {
    path=path.replace(/{id}/gi, this.id);
    return this.sendReq(method.toLowerCase(), path);
  });

  Then('I should get a code {int}', function (code) {
    this.request.status.should.eql(code);
  });

  Then('I should recive a {arg1} response', function (type) {
    this.request.headers['content-type'].match(new RegExp(type, 'i'));
  });

  Then('The "{arg1}" should contain "{arg2}"', function (path, keys) {
    this.request[path].should.have.properties(_.map(keys.split(','), (key) => {
      return key.trim();
    }));
  });
});

'use strict';

let _ = require('lodash');
let mongoose = require('mongoose');
let Oauth = require('../helpers/oauth.js');
let {ObjectId} = mongoose.Types;
let errorHandler = require('../helpers/errorHandler.js').mongo;
let User = mongoose.model('Users');

module.exports = {
  get,
  getMe,
  putMe,
  invite,
  getAll,
  create,
  setPassword,
  changePassword,
  updateSettings
};

function setPassword(req, res, next) {

  let {email, password} = req.body;
  let tokenEmail = _.get(req, 'token.attributes.email', undefined);

  User
  .find()
  .findByEmail(tokenEmail || email)
  .then((user) => {
    return user.setPassword(password)
    .then((user) => {
      user.sendPasswordChangeEmail();
      return user.save();
    });
  })
  .then((user) => {
    res.json({
      email: user.email,
      success: true,
      message: 'Your password has been updated successfully'
    });
  })
  .catch((err) => errorHandler(err, res, next));
}

function changePassword(req, res, next) {

  let {oldPassword, newPassword} = req.body;
  let {email} = req.token.attributes;

  User
  .find()
  .findByEmail(email)
  .then((user) => {
    return user.checkPassword(oldPassword)
    .then(function changePassword(valid) {
      if (valid){
        return user.setPassword(newPassword)
        .then((user) => {
          user.sendPasswordChangeEmail();
          return user.save();
        });
      } else {
        throw {
          code: 401
        };
      }
    });
  })
  .then(() => {
    res.json({
      success: true,
      message: 'Your password has been updated successfully'
    });
  })
  .catch((err) => errorHandler(err, res, next));
}

function invite(req, res, next) {
  let {body} = req;

  let user = new User(body);

  return user
  .forceSave()
  .then(() => {
    return Oauth.getCredentials(user.email, 'password');
  })
  .then((token)=>{
    return user.sendInviteEmail(token);
  })
  .then(()=>{
    res.json({
      success: true,
      message: 'The user will recive a email with the instructions to access the account.'
    });
  })
  .catch((err) => errorHandler(err, res, next));
}

function putMe(req, res, next) {
  let {attributes} = req.token;
  let {body} = req;

  User
  .find()
  .getById(new ObjectId(attributes._id))
  .then((user) => {
    return user.update(body);
  })
  .then((user) => {
    res.json(user.omit());
  })
  .catch((err) => errorHandler(err, res, next));
}

function updateSettings(req, res, next) {
  let id = req.swagger.params.id.value;
  let {body} = req;

  User
  .find().getById(new ObjectId(id))
  .then((user) => {
    user.settings = body;
    return user.save();
  })
  .then((user) => res.json(user.settings))
  .catch((err) => errorHandler(err, res, next));
}

function getMe(req, res, next) {
  let {attributes} = req.token;

  User
  .find()
  .getById(new ObjectId(attributes._id))
  .then((newUser) => {
    res.json(newUser.omit());
  })
  .catch((err) => errorHandler(err, res, next));
}

function get(req, res, next) {
  let id = req.swagger.params.id.value;

  User
  .find()
  .getById(new ObjectId(id))
  .then((newUser) => {
    res.json(newUser.omit());
  })
  .catch((err) => errorHandler(err, res, next));
}

function getAll(req, res, next) {

  User
  .find()
  .limit(50)
  .exec()
  .map((user) => {
    return user.omit();
  })
  .then((users) => {
    res.json(users);
  })
  .catch((err) => errorHandler(err, res, next));
}

function create(req, res, next) {
  let {body} = req;

  let user = new User(body);

  user
  .create()
  .then((newUser) => {
    res.json(newUser.omit());
  })
  .catch((err) => errorHandler(err, res, next));
}

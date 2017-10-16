'use strict';

let oauthHelper = require('../helpers/oauth');

module.exports = {
  verify,
  refresh,
  invalidate,
  accesstoken
};

function verify(req, res, next) {

  let {token, scope} = req.body;

  oauthHelper.verify(token, scope)
  .then((token) => {
    res.json(token);
  })
  .catch(next);
};

function accesstoken(req, res, next) {

  let {username, password, scope} = req.body;
  oauthHelper.accesstoken(username, password, scope)
  .then((token) => {
    res.json(token);
  })
  .catch(next);
};

function invalidate(req, res, next) {

  let {token} = req.body;
  oauthHelper.invalidate(token)
  .then(() => {
    res.json({
      token,
      message: 'Token invalidated'
    });
  }).catch(next);
};

function refresh(req, res, next) {

  let {refresh_token} = req.body;
  oauthHelper.refresh(refresh_token)
  .then((token) => {
    res.json(token);
  })
  .catch(next);
};

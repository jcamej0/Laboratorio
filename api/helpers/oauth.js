'use strict';

const debug = require('debug')('oauth');
const bluebird = require('bluebird');
const OauthProvider = require('volos-oauth-redis');
const helper = require('./helper.js');
const oauthConfig = {
  encryptionKey: require('../../env/').oauth.encryptionKey,
  validGrantTypes: [
    'client_credentials',
    'authorization_code',
    'implicit_grant',
    'password'
  ],
  passwordCheck: helper.passwordCheck,
  beforeCreateToken: helper.beforeCreateToken
};

const {key, secret} = require('../../credentials.json').app.credentials[0];

debug('Create client');
let oauth = bluebird.promisifyAll(
  OauthProvider.create(oauthConfig)
);

module.exports = {
  verify,
  refresh,
  invalidate,
  accesstoken,
  getCredentials
};

function verify(token, scopes) {
  debug('Verify Token: "' + token + '" scope: ' + scopes);
  return oauth.verifyTokenAsync('Bearer ' + token, scopes);
};

function accesstoken(user, password, scope) {
  debug('Generate Access Token for: "' + user + '" scope: ' + scope);
  let request = {
    'grant_type': 'password',
    'client_id': key,
    'client_secret': secret,
    'username': user,
    'password': password,
    'scope': scope || 'admin'
  };

  return oauth.generateTokenAsync(request);
};

function getCredentials(user, scope) {

  debug('Generate Credentials for: "' + user + '" scope: ' + scope);
  let request = {
    'grant_type': 'client_credentials',
    'client_id': key,
    'client_secret': secret,
    'username': user,
    'scope': scope || 'admin'
  };

  return oauth.generateTokenAsync(request);
};

function invalidate(token) {
  debug('Invalidate Token: "' + token);

  return oauth.invalidateTokenAsync({
    token: token,
    'token_type_hint': 'refresh_token',
    'client_id': key,
    'client_secret': secret
  }, {
    authorizeHeader: 'Bearer ' + token
  });
};

function refresh(token) {
  debug('Refresh Credentials for: "' + token);
  return oauth.refreshTokenAsync({
    'grant_type': 'refresh_token',
    'refresh_token': token,
    'client_id': key,
    'client_secret': secret
  }, {
    authorizeHeader: 'Bearer ' + token
  });
};

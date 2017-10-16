'use strict';

const P = require('bluebird');
const _ = require('lodash');
const oauth = require('volos-management-redis');
const fs = P.promisifyAll(require('fs'));

const credentialPath = './credentials.json';
let config = require('./env').oauth;
const oauthManager = P.promisifyAll(oauth.create({
  encryptionKey: config.encryptionKey
}));

runRedisOauth(config)
.finally(() => {
  process.exit(0);
});

function getCurrentApp() {
  return fs.accessAsync(credentialPath, fs.F_OK)
  .then(() => {
    return require(credentialPath).app;
  });
}

function createDev(dev) {

  return oauthManager.getDeveloperAsync(dev.email)
  .catch(() => {
    return oauthManager.createDeveloperAsync(dev);
  });

}

function createApp(app) {

  return getCurrentApp()
  .then((cred) => {
    cred.scopes = app.scopes;
    return oauthManager.updateAppAsync(cred);
  })
  .catch(() => {
    return oauthManager.createAppAsync(app);
  });
}

function runRedisOauth(config) {

  return createDev(config.developer).then((dev) => {

    let newApp = config.app;

    newApp.scopes = _.keys(config.scopes);

    newApp.developerId = dev.id;

    return createApp(newApp).then((app) => {

      let oautCredentials = {
        developer: dev,
        app: app
      };

      return fs.writeFileAsync(
        credentialPath,
        JSON.stringify(oautCredentials, ' ', 2)
      );

    });
  });
}

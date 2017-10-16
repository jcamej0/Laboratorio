'use strict';

require('shelljs/global');

const open = require('open');
const format = require('util').format;

const config = require(__dirname + '/env/').doc;

if (process.argv.indexOf('-i') !== -1){
  installSwaggerUI();
} else {
  runApiServer();
}


function moveToSwaggerUI() {
  cd(__dirname + '/node_modules/swagger-ui/');
}

function installSwaggerUI() {

  moveToSwaggerUI();

  exec('npm install', {});

  exec('npm run build', {});
}

function runApiServer() {
  cd(__dirname);

  const apiServer = exec(
    format('PORT=%s nodemon', config.apiPort),
    {async: true}
  );

  const serverReadyExp = /app is ready listening/;
  let flag = true;

  apiServer.stdout.on('data', function(data) {
    if (flag && serverReadyExp.test(data)){
      runDocServer();
      flag = false;
    }
  });
}

function openBrowser() {
  const path = format(
    'http://localhost:%s/%s',
    config.apiPort,
    config.apiPath
  );

  const url = encodeURIComponent(path);

  open(format('http://localhost:%s/?url=%s', config.docPort, url));
}

function runDocServer() {

  moveToSwaggerUI();

  const docServer = exec('npm run serve', {async: true});
  const serverReadyExp = /Server started/;

  docServer.stdout.on('data', function(data) {
    if (serverReadyExp.test(data)){
      openBrowser();
    }
  });
}

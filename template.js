'use strict';

const location = __dirname + '/app/';

const options = {
  cache: true
};

let ejs = require('ejs');
let bluebird = require('bluebird');
let fs = bluebird.promisifyAll(require('fs'));

module.exports = addTemplatePath;

function addTemplatePath(app) {
  app.get('/template/*', function getTemplate(req, res) {

    let url = req.originalUrl.replace('/template/', location);

    fs.accessAsync(url, fs.F_OK)
    .then(function getFileContent() {

      return fs.readFileAsync(url, 'utf8');
    })
    .then(function compileTemplate(file) {
      options.filename = url;
      res.send(ejs.render(file, {}, options));
    })
    .catch(function generateError() {
      res.status(404).send();
    });

  });
}

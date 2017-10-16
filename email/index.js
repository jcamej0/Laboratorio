'use strict';

let templates = {};
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let handlebars = require('handlebars');
let debug = require('debug')('email');

let {email, isDevelop} = require('../env/');
let mailgun = require('mailgun-js')({
  apiKey: email.apiKey,
  domain: email.domain
});

let mg = Promise.promisifyAll(mailgun.messages());

module.exports = {
  sendEmail: sendEmail
};

function sendEmail(templateName, from, to, subject, data) {

  return getTemplate(templateName)
    .then(function compile(template) {
      let emailData = {
        from: from + '@' + email.domain,
        to: isDevelop()? email.redirect : to,
        subject: subject,
        html: template(data)
      };
      debug('Send email template "' + templateName + '" to ' + emailData.to + '.');
      return mg.sendAsync(emailData)
        .then((e) => {
          debug('Email "' + templateName + '" send successfully to ' + emailData.to + '.');
          return e;
        })
        .catch((e) => {
          return e;
        });
    });
}

function getTemplate(name) {

  const path = '/dist/';
  const ext = '.html';

  let view = templates[name];

  if (view) {
    debug('Get template from cache');
    return Promise.resolve(view);
  } else {

    return fs.readFileAsync(__dirname + path + name + ext, 'utf8')
      .then((template) => {
        debug('Cache template data');
        templates[path] = handlebars.compile(template);
        return templates[path];
      });
  }
}

'use strict';

const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const bluebird = require('bluebird');

const apiConfig = require('./env').api;

const port = process.env.PORT || 5000;

// Basic Cors
app.use(cors());

// Basic Security
app.use(helmet());

// Set pug as view engine
app.set('view engine', 'ejs');

// Serve static content
app.use('/app', express.static(__dirname + '/app'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Used for docs
app.use('/swagger', express.static(__dirname + apiConfig.path));

// Serve static content
app.use('/jspm_packages', express.static(__dirname + '/jspm_packages'));

require('./template.js')(app);

// Swagger Configuration

const SwaggerExpress = bluebird.promisifyAll(require('swagger-express-mw'));
const config = {
  appRoot: __dirname
};

module.exports = require('./build.js')
  .then(() => require('./api/mongoose/'))
  .then(() => {
    return SwaggerExpress.createAsync(config)
      .then((swaggerExpress) => {

        // install middleware
        swaggerExpress.register(app);

        app.listen(port);

        app.get('/*', function (req, res) {
          // Ignore api calls
          if (/^\/api/.test(req.url)) {
            return;
          }
          res.render('index', {title: 'Hey', message: 'Hello there!'});
        });

        console.log('app is ready listening on http://localhost:' + port);  // eslint-disable-line

        return app;
      });
  }).catch(console.error);

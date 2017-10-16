## Prerequisites

Before running the project several applications need to be installed

- [NodeJS](https://nodejs.org/en/)
- [gulp](http://gulpjs.com/)
- [bower](https://bower.io/)
- [MongoDB](https://www.mongodb.com/es)
- [Redis](http://redis.io/)
- [Sass](http://sass-lang.com/)


## Angular Dependencies

This project has many angular dependencies:

- [ui-router](https://github.com/angular-ui/ui-router) Handles view routing
- [restangular](https://github.com/mgonto/restangular) Handles HTTP calls to the api
- [Material Angular](https://material.angularjs.org/latest/)

## Run Services

Before running the project, some deamon services need to be running (mongo, redis), for this you need to execute this commands.

```shel
sudo service redis-server start
sudo service mongod start
```

## Get Started

After installing node you will need to run several commands

```shel
sudo npm install -g nodemon bower gulp
npm install
```

## Build Emails

This project sends automatic emails with test results, alerts and notifications, for them to work you need to build them.

```shel
npm run email-start // You can preview the emails on you browser
npm run email-build // This build emails that can be properly display in email clients
```

## Set Up You Environment

The project uses a set of variables per environment, to connect to the database, Redis, configure token generation, and email configurations, a base example of the default variables are located on `/env/example.json`, to add specific variables that apply to you, you need to create a `develop.json` file and change the variables.

## Running the app

After installing the project you need to run the app, and access [http://localhost:5000](http://localhost:5000), thanks to nodemon every time a change is made the app will reset.

```shel
npm run run
```

## Running Scripts

```shel
npm run run # Runs the project with nodemon
npm run debug # Runs project on debug mode
npm run docs # Generates documentation
npm run lint # Lints the code to check for inconsistencies
npm run develop # Watch the code and generates the js on save
npm run build # Generates the js file on compile mode (minify js, builds production bundle)
npm run test # Runs tests features using cucumber
```
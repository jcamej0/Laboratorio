'use strict';

module.exports = {
  mongo
};

function mongo(err, res, next) {

  if (!!err.code) {
    let error;
    switch (err.code){
    case 11000:{
      error = {
        code: 409,
        mongoCode: 11000,
        message: 'Duplicated entry'
      };
      break;
    }
    case 404:{
      error = {
        code: err.code,
        message: err.modelName + ' ' + err.message
      };
      break;
    }
    case 401:{
      error = {
        code: err.code,
        message: 'Invalid Credentials'
      };
      break;
    }
    }

    if (error) {
      res.status(error.code).json(error);
    } else {
      next(err);
    }
  } else {

    next(err);
  }
}

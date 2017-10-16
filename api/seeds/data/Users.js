'use strict';

let {mock} = require('../../mocks/');

module.exports = mock('users')
.then((data) => {

  data.push({
    firstName: 'Gustavo',
    lastName: 'Laguna',
    email: 'gustavo.gelf@gmail.com',
    status: 'created',
    password: '123456',
    idNumber: 19005898,
    idType: 'v'
  });
  return {
    data,
    model: 'Users'
  };
});

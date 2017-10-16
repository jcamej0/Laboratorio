'use strict';

let Species = require('./Species.js');

module.exports = Species.then((ref) => {
  let [, cat] = ref.data;

  let breeds = [
    {
      name: 'Abyssinian',
      refs: {
        'species': cat
      }
    },
    {
      name: 'American Bobtail',
      refs: {
        'species': cat
      }
    },
    {
      name: 'American Curl',
      refs: {
        'species': cat
      }
    },
    {
      name: 'American Shorthair',
      refs: {
        'species': cat
      }
    },
    {
      name: 'American Wirehair',
      refs: {
        'species': cat
      }
    }
  ];

  return {
    data: breeds,
    ref,
    model: 'Breeds'
  };
});

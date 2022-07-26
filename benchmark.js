const benchmark = require('nodemark');
const sort = require('./benchmark/sort');

const functions = new Map();
functions.set('sort', sort);

for (const [key, value] of functions) {
  console.log(key, + " " + benchmark(value));
}


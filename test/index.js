'use strict';

const deepmerge = require( '../src' );

const allGrantOptions = [
  [ 1 ], [ 2 ], [ 3 ],
];

const target = [ 0, 1, 2 ];
const result = deepmerge( target, allGrantOptions, { array: { union: true } } );

console.log( JSON.stringify( target, null, 2 ) );
console.log( JSON.stringify( result, null, 2 ) );

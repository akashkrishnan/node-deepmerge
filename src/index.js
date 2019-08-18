'use strict';

const _ = require( 'lodash' );

module.exports = ( target, sources, options ) => {

  options = resolveOptions( options );

  if ( !Array.isArray( sources ) ) {
    return target;
  }

  for ( const source of sources ) {
    target = merge( target, source, options );
  }

  return target;

};

function resolveOptions( options ) {
  options = Object.assign( {}, options );
  options.array = Object.assign( {}, options.array );
  options.object = Object.assign( {}, options.object );
  return options;
}

function merge( target, source, options ) {

  if ( Array.isArray( target ) && Array.isArray( source ) ) {
    return mergeArray( target, source, options );
  }

  if ( _.isPlainObject( target ) && _.isPlainObject( source ) ) {
    return mergeObject( target, source, options );
  }

  return _.cloneDeep( source );

}

function mergeArray( target, source, options ) {

  if ( options.array.replace ) {
    return mergeArrayByReplace( target, source );
  }

  if ( options.array.union ) {
    return mergeArrayByUnion( target, source );
  }

  if ( options.array.byIndex ) {
    return mergeArrayByIndex( target, source, options );
  }

  return mergeArrayByConcat( target, source, options );

}

function mergeArrayByReplace( target, source ) {
  source = _.cloneDeep( source );
  target.splice( 0, target.length, ...source );
  return target;
}

function mergeArrayByUnion( target, source ) {
  return mergeArrayByReplace( target, _.union( target, source ) );
}

function mergeArrayByIndex( target, source, options ) {

  const n = Math.max( target.length, source.length );

  for ( let i = 0; i < n; ++i ) {
    if ( i < source.length ) {
      target[ i ] = merge( target[ i ], source[ i ], options );
    }
  }

  return target;

}

function mergeArrayByConcat( target, source ) {
  return mergeArrayByReplace( target, _.concat( target, source ) );
}

function mergeObject( target, source, options ) {

  if ( options.object.replace ) {
    return mergeObjectByReplace( target, source );
  }

  return mergeObjectByKey( target, source, options );

}

function mergeObjectByReplace( target, source ) {

  source = _.cloneDeep( source );

  Object
    .getOwnPropertyNames( target )
    .forEach( p => delete target[ p ] );

  Object
    .getOwnPropertyNames( source )
    .forEach( p => target[ p ] = source[ p ] );

  return target;

}

function mergeObjectByKey( target, source, options ) {

  const props = _.union(
    Object.getOwnPropertyNames( target ),
    Object.getOwnPropertyNames( source ),
  );

  for ( const p of props ) {
    if ( p in source ) {
      target[ p ] = merge( target[ p ], source[ p ], options );
    }
  }

  return target;

}

const isObject = require('lodash.isplainobject');

function process( obj, prefix, storage ) {

    const before = ( prefix ) ? `${prefix}.` : '';

    for ( let key in obj ) {

        if ( !obj.hasOwnProperty( key ) ) {
            continue;
        }

        let prop = `${before}${key}`;

        if ( isObject( obj[ key ] ) ) {

            process( obj[ key ], prop, storage );

            continue;
        }

        storage[ prop ] = obj[ key ];
    }

    return storage;
}

module.exports = function( source, prefix ) {

    const result = {};

    process( source, prefix, result );

    return result;
};
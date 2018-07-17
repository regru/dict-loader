const get = require('lodash.get');

module.exports = function( compilerOptions, filters ) {

    const names = get( compilerOptions, 'bem', 'default' );
    const result = [];

    filters.forEach( function( filter ) {
        const curentName = Object.keys( filter ).pop();

        if ( curentName === names ) {
            return result.push( filter[ curentName ] );
        }

        if ( Array.isArray( names ) && names.includes( curentName ) ) {
            result.push( filter[ curentName ] );
        }
    } );

    return result;
};

const get = require('lodash.get');

module.exports = function( config, filters ) {

    const names = get( config, 'bem', 'default' );

    return Array.from( filters.filter(
        filter => Array.isArray( names )
            ? ~names.indexOf( Object.keys( filter ).pop() )
            : Object.keys( filter ).pop() === names
    ), filter => filter[ Object.keys( filter ).pop() ] );
};

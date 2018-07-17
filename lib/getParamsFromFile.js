const path = require('path');

function getParam( file, regexp, fallback ) {

    if ( !regexp ) {
        return fallback;
    }

    const matches = file.match( new RegExp( regexp ) );

    return matches
        ? matches[ 1 ]
        : fallback;
}

module.exports = function( filename, opts ) {

    const basename = path.basename( filename );

    return {
        locale    : getParam( basename, opts.testLocale, opts.fallback ),
        namespace : getParam( basename, opts.testNamespace, '' ),
    };
};
const loaderUtils = require('loader-utils');
const get = require('lodash.get');
const omit = require('object.omit');

const flatten = require('./lib/flatten');
const createFiltersQueue = require('./lib/createFiltersQueue');
const getParamsFromFile = require('./lib/getParamsFromFile');
const validate = require('./lib/validator/validate');

const applyFilters = require('./lib/applyFilters');

module.exports = function( source ) {

    if ( this.cacheable ) {
        this.cacheable();
    }

    const options = loaderUtils.getOptions( this );
    const jsonContent = JSON.parse( source.toString() );

    const compileOpts = get( jsonContent, 'compile_options', {} );
    const getQueue = createFiltersQueue( compileOpts.defaults );
    const content = omit( jsonContent, 'compile_options' );
    const dict = flatten( content, options.fsParams.namespace );

    validate( options );

    options.fsParams = getParamsFromFile( this.resourcePath, options.babelfish );
    options.compileOptions = compileOpts;

    const result = {
        fallback : options.babelfish.fallback,
        locales  : {
            [ options.fsParams.locale ] : {},
        },
    };

    for ( let key in dict ) {

        if ( !dict.hasOwnProperty( key ) ) {
            continue;
        }

        const filtersQueue = getQueue( key );
        const phrase = key.replace( /-(?:bem|tg|md)/g, '' );

        result.locales[ options.fsParams.locale ][ phrase ] = applyFilters( dict[ key ], filtersQueue, options );
    }

    return `module.exports = ${JSON.stringify( result )}`;
};

module.exports.raw = true;

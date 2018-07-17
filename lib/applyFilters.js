const BemFilter = require('./filters/bem');
const TgFilter = require('./filters/typograf');
const MdFilter = require('./filters/markdown');

const getBemFilters = require('./getBemFilters');

module.exports = function( text, filtersQueue, options ) {
    const filters = getBemFilters( options.compileOptions, options.bemFilters );
    const bemFilter = new BemFilter( { filters } );
    const tgFilter = new TgFilter( options.locale, options.typograf );
    const mdFilter = new MdFilter( options.markdown );

    let result = text;

    filtersQueue.forEach( function( filter ) {
        switch ( filter ) {
            case 'bem':
                result = bemFilter.apply( result );

                break;

            case 'tg':
                result = tgFilter.apply( result );

                break;

            case 'md':
                result = mdFilter.apply( result );

                break;
        }
    } );

    return result;
};
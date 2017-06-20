const path = require('path');

const loaderUtils = require('loader-utils');
const get = require('lodash.get');
const omit = require('object.omit');

const flatten = require('./lib/flatten');
const getFsParams = require('./lib/getFsParams');
const BemFilter = require('./lib/filters/bem');
const TgFilter = require('./lib/filters/typograf');
const MdFilter = require('./lib/filters/markdown');

module.exports = function(source) {

    if (this.cacheable) {
        this.cacheable();
    }

    const options = loaderUtils.getOptions(this);
    const jsonDict = JSON.parse( source.toString() );
    const cplOpts = get(jsonDict, 'compile_options', {});
    const content = omit(jsonDict, 'compile_options');

    const fsParams = getFsParams(
        Object.assign({}, options.babelfish, {
            file: this.resourcePath,
        }));
    const dict = flatten(content, fsParams.namespace);

    const tgFilter = new TgFilter(
        Object.assign({}, options.typograf, {
            locale: fsParams.locale
        })
    );
    tgFilter.init();

    const bemFilter = new BemFilter({
        compiler: cplOpts,
        filtersList: options.bemFilters
    });
    bemFilter.init();

    const mdFilter = new MdFilter(options.markdown);
    mdFilter.init();

    const result = {
        fallback: options.babelfish.fallback,
        locales: {
            [ fsParams.locale ]: {},
        }
    };

    for ( let key in dict ) {

        if ( !dict.hasOwnProperty(key) ) {
            continue;
        }

        const entities = key.split('-');
        const filterQueue = [ ...entities.slice(1).reverse(), ...get(cplOpts, 'defaults',[]) ];
        let phrase = entities[ 0 ];

        filterQueue.forEach(function (filter) {
            switch (filter) {
                case 'bem':
                    dict[ key ] = bemFilter.apply(dict[ key ]);

                    break;

                case 'tg':
                    content[ key ] = tgFilter.apply(dict[ key ]);

                    break;

                case 'md':
                    dict[ key ] = mdFilter.apply(dict[ key ]);

                    break;

                default:
                    phrase = key;
            }
        });

        result.locales[ fsParams.locale ][ phrase ] = dict[ key ];
    }

    return `module.exports = ${JSON.stringify(result)}`;
};

module.exports.raw = true;

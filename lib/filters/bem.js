const at = require('lodash.at');
const cheerio = require('cheerio');

const getBemFilters = require('../getBemFilters');
const BaseFilter = require('./baseFilter');

class BemFilter extends BaseFilter {

    init() {
        this.filters = getBemFilters(this.options.compiler, this.options.filtersList);
    }

    _apply(text) {
        const $ = cheerio.load(text);

        for (let filter of this.filters) {

            if (!filter) {
                continue;
            }

            Object.keys(filter).forEach(function(type) {

                switch (type) {
                    case 'classes':
                        let classes = filter.classes;

                        for (let tag in classes) {

                            if ( !classes.hasOwnProperty(tag) ) {
                                continue;
                            }

                            $(tag).addClass(classes[ tag ]);
                        }

                        break;
                    case 'attrs':
                        let attrs = filter.attrs;

                        for (let tag in attrs) {

                            if (!attrs.hasOwnProperty( tag )) {
                                continue;
                            }

                            Object.keys( attrs[tag] ).forEach(function (attrName) {
                                $(tag).attr(attrName, attrs[ tag ][ attrName ]);
                            });
                        }

                        break;

                    case 'ext_rel':
                    case 'ext_target':
                        const attr = type.replace('ext_', '');

                        $('a').each( function (i, el) {
                            const href = $(el).attr('href');

                            if ( /^https?/.test(href) ) {
                                $(el).attr(attr, filter[ type ]);
                            }
                        } );

                        break;
                }
            });
        }

        return $.text();
    }
}

module.exports = BemFilter;

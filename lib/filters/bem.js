const at = require('lodash.at');
const { JSDOM } = require('jsdom');

const getBemFilters = require('../getBemFilters');
const BaseFilter = require('./baseFilter');

class BemFilter extends BaseFilter {

    init() {
        this.filters = getBemFilters(this.options.compiler, this.options.filtersList);
    }

    _apply(text) {
        const nodeFragment = JSDOM.fragment(`<div id="jsdom_wrapper">${text}</div>`);

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

                            nodeFragment.querySelectorAll(tag).forEach( node => node.classList.add(classes[ tag ]) );
                        }

                        break;
                    case 'attrs':
                        let attrs = filter.attrs;

                        for (let tag in attrs) {

                            if (!attrs.hasOwnProperty( tag )) {
                                continue;
                            }

                            Object.keys( attrs[tag] ).forEach(function (attrName) {
                                nodeFragment.querySelectorAll(tag).forEach( node => node.setAttribute(attrName, attrs[ tag ][ attrName ]) );
                            });
                        }

                        break;

                    case 'ext_rel':
                    case 'ext_target':
                        const attr = type.replace('ext_', '');

                        nodeFragment.querySelectorAll('a').forEach(el => {
                            const href = el.getAttribute('href');

                            if ( /^https?/.test(href) ) {
                                el.setAttribute(attr, filter[ type ]);
                            }
                        });

                        break;
                }
            });
        }

        return nodeFragment.firstChild.innerHTML;
    }
}

module.exports = BemFilter;

const getBemFilters = require('../getBemFilters');
const BaseFilter = require('./baseFilter');

class BemFilter extends BaseFilter {

    constructor( options ) {
        super( options );
    }

    _init( options ) {
        this.filters = getBemFilters( options.compiler, options.filtersList );
    }

    _setOrAddAttr( text, tag, attrName, attrDef, condFn ) {
        const tagRe = new RegExp( `<(${tag})\\b([^/>]*)`, 'g' );

        return text.replace( tagRe, function( match, tag, attrs ) {
            let fixedAttrs;

            if ( typeof condFn === 'function' && !condFn( match, tag, attrs ) ) {
                return match;
            }

            if ( !( new RegExp( `${attrName}` ) ).test( attrs ) ) {
                let entityArr = attrDef
                    ? [ `<${tag}`, `${attrs.trim()}`, `${attrName}="${attrDef}"` ]
                    : [ `<${tag}`, `${attrs.trim()}`, `${attrName}` ];

                return entityArr.filter( el => el.length ).join(' ')
            }

            if ( !attrDef ) {
                return match;
            }

            fixedAttrs = attrs.replace( new RegExp( `${attrName}="([\\w\\d-]+)"` ), `${attrName}="$1 ${attrDef}"` );

            return `<${tag} ${fixedAttrs.trim()}`;
        } );
    }

    _apply(text) {
        let res = text;

        for (let filter of this.filters) {

            if (!filter) {
                continue;
            }

            Object.keys(filter).forEach( type => {

                switch (type) {
                    case 'classes':
                        let classes = filter.classes;

                        for (let tag in classes) {

                            if ( !classes.hasOwnProperty(tag) ) {
                                continue;
                            }

                            res = this._setOrAddAttr( res, tag, 'class', classes[ tag ] );
                        }

                        break;
                    case 'attrs':
                        let attrs = filter.attrs;

                        for (let tag in attrs) {

                            if (!attrs.hasOwnProperty( tag )) {
                                continue;
                            }

                            Object.keys( attrs[tag] ).forEach( attrName => {
                                res = this._setOrAddAttr( res, tag, attrName, attrs[ tag ][ attrName ] );
                            });
                        }

                        break;

                    case 'ext_rel':
                    case 'ext_target':
                        const attrName = type.replace('ext_', '');

                        res = this._setOrAddAttr( res, 'a', attrName, filter[ type ], function ( matches, tag, attrs ) {
                            return /^https?/.test(attrs);
                        } );

                        break;
                }
            });
        }

        return res;
    }
}

module.exports = BemFilter;

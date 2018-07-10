const Typographer = require('typograf');
const omit = require('object.omit');
const get = require('lodash.get');

const BaseFilter = require('./baseFilter');

class TgFilter extends BaseFilter {
    constructor( options ) {
        super( options );
    }

    _processRules( rule, action ) {
        this.tg[`${action}Rule`]( rule );
    }

    _init( options ) {
        const rules = get( options, 'rules', {} );

        options.locale = options.locale === 'ru' ? 'ru' : 'common';
        this.tg = new Typographer( omit( options, 'rules' ) );


        if ( rules.disabled ) {
            rules.disabled.forEach( rule => {
                this._processRules( rule, 'disable' );
            } );
        }

        if ( rules.enabled ) {
            rules.enabled.forEach( rule => {
                this._processRules( rule, 'enable' );
            } );
        }
    }

    _apply( text ) {
        return this.tg.execute( text );
    }
}

module.exports = TgFilter;

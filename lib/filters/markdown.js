const Markdown = require('markdown-it');

const plugin = require('./plugins/babelfish');
const BaseFilter = require('./baseFilter');

class MdFilter extends BaseFilter {
    constructor( options ) {
        super( options );
    }

    _init( options ) {
        const md = this.md = Markdown( options );
        
        md.use( plugin );
    }

    _apply( text ) {
        return this.md.render( text );
    }
}

module.exports = MdFilter;

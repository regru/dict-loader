/*
 * Prevent babelfish interpolation #{} escaping
 * Remove single paragraph tag
 */

module.exports = function(md) {

    const defaultRenderer = md.renderer.renderToken.bind(md.renderer);

    function babelfish(state) {

        const renderClear = function( tokens, idx, options ) {

            const token = tokens[ idx ];
            const type = token.type;
            const pLength = tokens.filter(function( token ) { return token.type === 'paragraph_open'; }).length;

            if (pLength == 1 && ( type === 'paragraph_open' || type ===  'paragraph_close' ) ) {
                return '';
            }

            return defaultRenderer( tokens, idx, options )
                .trim();
        };

        if ( !~state.src.indexOf( '#{' ) ) {

            md.renderer.renderToken = renderClear;

            return false;
        }

        md.renderer.renderToken = function( tokens, idx, options ) {

            const token = tokens[ idx ];

            if ( token.type === 'link_open' ) {
                return renderClear( tokens, idx, options )
                    .replace( /([^"]*)#%7B([^"]+)%7D/g, '$1#{$2}' );
            }

            return renderClear( tokens, idx, options );
        };
    }

    md.core.ruler.push( 'babelfish', babelfish );
};

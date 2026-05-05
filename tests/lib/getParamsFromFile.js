const getOptionsFromFile = require('../../lib/getParamsFromFile');

const options = {
    fallback      : 'ru',
    testNamespace : /^([\w-]+)\.js/,
    testLocale    : /([a-z]{2})_[A-Z]{2}\.\w+/,
};

describe( 'lib/getParamsFromFileName', function() {
    it( 'Should get locale option from filename', function() {
        const res = getOptionsFromFile( 'namespace.js.de_DE.yaml', options );

        expect( res.locale ).toEqual('de');
    } );

    it( 'Should get namespace option from filename', function() {
        const res = getOptionsFromFile( 'namespace.js.de_DE.yaml', options );

        expect( res.namespace ).toEqual('namespace');
    } );

    it( 'Should fall back to default if can\'t get locale', function() {
        const res = getOptionsFromFile( 'namespace.js.de.yaml', options );

        expect( res.locale ).toEqual('ru');
    } );
} );
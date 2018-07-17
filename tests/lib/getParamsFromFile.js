const should = require('chai').should(); // eslint-disable-line no-unused-vars
const getOptionsFromFile = require('../../lib/getParamsFromFile');

const options = {
    fallback      : 'ru',
    testNamespace : /^([\w-]+)\.js/,
    testLocale    : /([a-z]{2})_[A-Z]{2}\.\w+/,
};

suite( 'lib/getParamsFromFileName', function() {
    test( 'Should get locale option from filename', function() {
        const res = getOptionsFromFile( 'namespace.js.de_DE.yaml', options );

        res.locale.should.be.eql('de');
    } );

    test( 'Should get namespace option from filename', function() {
        const res = getOptionsFromFile( 'namespace.js.de_DE.yaml', options );

        res.namespace.should.be.eql('namespace');
    } );

    test( 'Should fall back to default if can\'t get locale', function() {
        const res = getOptionsFromFile( 'namespace.js.de.yaml', options );

        res.locale.should.be.eql('ru');
    } );
} );
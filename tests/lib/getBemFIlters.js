const should = require('chai').should(); // eslint-disable-line no-unused-vars

const getBemFilters = require('../../lib/getBemFilters');

suite( 'lib/getBemFilters', function() {

    const data = require('../fixtures/bemRules');

    test( 'Should get default filter if none specified', function() {
        const res = getBemFilters( {}, data );

        res.length.should.be.eql( 1 );
        res[ 0 ].should.be.eql( data[ 0 ].default );
    } );

    test( 'Should return filters according to specified', function() {
        const res = getBemFilters( { bem: [ 'default', 'jobs' ] }, data );

        res.length.should.be.eql( 2 );
        res[ 0 ].should.be.eql( data[ 0 ].default );
        res[ 1 ].should.be.eql( data[ 1 ].jobs );
    } );
} );
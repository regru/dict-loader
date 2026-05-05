const getBemFilters = require('../../lib/getBemFilters');

describe( 'lib/getBemFilters', function() {

    const data = require('../fixtures/bemRules');

    it( 'Should get default filter if none specified', function() {
        const res = getBemFilters( {}, data );

        expect( res.length ).toEqual( 1 );
        expect( res[ 0 ] ).toEqual( data[ 0 ].default );
    } );

    it( 'Should return filters according to specified', function() {
        const res = getBemFilters( { bem: [ 'default', 'jobs' ] }, data );

        expect( res.length ).toEqual( 2 );
        expect( res[ 0 ] ).toEqual( data[ 0 ].default );
        expect( res[ 1 ] ).toEqual( data[ 1 ].jobs );
    } );
} );
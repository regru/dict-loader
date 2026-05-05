const flatten = require('../../lib/flatten');

describe( 'lib/flatten', function() {

    const data = require('../fixtures/simpleInitData');

    it( 'Should join nests keys with dot glue', function() {

        expect( flatten( data, 'ns' ) ).toEqual( {
            'ns.foo'           : 'bar',
            'ns.foo1.bar1'     : 'simple text',
            'ns.foo1.bar2'     : [ 'simple', 'array' ],
            'ns.foo1.bar3.baz' : 'simple text',
        } );

    } );
} );
const should = require('chai').should(); // eslint-disable-line no-unused-vars

const flatten = require('../../lib/flatten');

suite( 'lib/flatten', function() {

    const data = require('../fixtures/simpleInitData');

    test( 'Should join nests keys with dot glue', function() {

        flatten( data, 'ns' ).should.be.eql( {
            'ns.foo'           : 'bar',
            'ns.foo1.bar1'     : 'simple text',
            'ns.foo1.bar2'     : [ 'simple', 'array' ],
            'ns.foo1.bar3.baz' : 'simple text',
        } );

    } );
} );
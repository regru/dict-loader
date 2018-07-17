const should = require('chai').should(); // eslint-disable-line no-unused-vars

const createFiltersQueue = require('../../lib/createFiltersQueue');

suite( 'lib/createFiltersQueue', function() {
    let getQueueFromKey = createFiltersQueue( [ 'bem' ] );

    test( 'Should return default queue if none comes with key', function() {
        const queue = getQueueFromKey('key');

        queue.should.be.eql( [ 'bem' ] );
    } );

    test( 'Should get queue from key definition and place if before defaults', function() {
        const queue = getQueueFromKey('key-tg');

        queue.should.be.eql( [ 'tg', 'bem' ] );
    } );

    test( 'Should reverse given queue', function() {
        const queue = getQueueFromKey('key-tg-md');

        queue.should.be.eql( [ 'md', 'tg', 'bem' ] );
    } );

    test( 'Should deduplicate queue', function() {
        const queue = getQueueFromKey('key-bem-tg');

        queue.should.be.eql( [ 'tg', 'bem' ] );
    } );

    test( 'Should return queue from key if default value wasn\'t set', function() {
        const getQueueFromKey = createFiltersQueue();
        const queue = getQueueFromKey('key-bem-tg');

        queue.should.be.eql( [ 'tg', 'bem' ] );
    } );
} );
const createFiltersQueue = require('../../lib/createFiltersQueue');

describe( 'lib/createFiltersQueue', function() {
    let getQueueFromKey = createFiltersQueue( [ 'bem' ] );

    it( 'Should return default queue if none comes with key', function() {
        const queue = getQueueFromKey('key');

        expect( queue ).toEqual( [ 'bem' ] );
    } );

    it( 'Should get queue from key definition and place if before defaults', function() {
        const queue = getQueueFromKey('key-tg');

        expect( queue ).toEqual( [ 'tg', 'bem' ] );
    } );

    it( 'Should reverse given queue', function() {
        const queue = getQueueFromKey('key-tg-md');

        expect( queue ).toEqual( [ 'md', 'tg', 'bem' ] );
    } );

    it( 'Should deduplicate queue', function() {
        const queue = getQueueFromKey('key-bem-tg');

        expect( queue ).toEqual( [ 'tg', 'bem' ] );
    } );

    it( 'Should return queue from key if default value wasn\'t set', function() {
        const getQueueFromKey = createFiltersQueue();
        const queue = getQueueFromKey('key-bem-tg');

        expect( queue ).toEqual( [ 'tg', 'bem' ] );
    } );
} );
module.exports = function createFiltersQueue( defaults = [] ) {

    const defaultQueue = defaults;

    return function getQueueFromKey( key ) {
        const entities = key.split('-');
        const keyQueue = entities.slice( 1 ).filter( elem => [ 'md', 'tg', 'bem' ].includes( elem ) );

        return keyQueue
            .reverse()
            .concat(
                defaultQueue
                    .filter( elem => !keyQueue.includes( elem ) )
                    .reverse()
            );
    };
};

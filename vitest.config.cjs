/** @type {import('vitest/config').UserConfig} */
module.exports = {
    test: {
        environment: 'node',
        include: [ 'tests/**/*.js' ],
        exclude: [ 'tests/fixtures/**' ],
        globals: true,
    },
};


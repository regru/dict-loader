const validate = require('../../lib/validator/validate');

const optionsObj = {
    babelfish : {
        fallback      : 'ru',
        testNamespace : /^([\w-]+)\.js/,
        testLocale    : /([a-z]{2})_[A-Z]{2}\.\w+/,
    },
    typograf : {},
    markdown : {},
};

describe( 'lib/validator/validate', function() {

    it( 'Should throw if none options passed', function() {
        expect( () => validate() ).toThrow();
    } );

    it( 'Should not throw if typograph or markdown options were not passed', function() {
        const res = validate( { babelfish: optionsObj.babelfish } );

        expect( res ).toBe( true );
    } );

    it( 'Should throw if babelfish options is not valid', function() {
        const fallbackObj = {
            babelfish : {
                fallback      : {},
                testNamespace : /^([\w-]+)\.js/,
                testLocale    : /([a-z]{2})_[A-Z]{2}\.\w+/,
            },
        };

        const localeObj = {
            babelfish : {
                fallback      : 'ru',
                testNamespace : /^([\w-]+)\.js/,
                testLocale    : 'string',
            },
        };

        const capturingObj = {
            babelfish : {
                fallback      : 'ru',
                testNamespace : /^([\w-]+)\.js/,
                testLocale    : /[a-z]+/,
            },
        };

        expect( () => validate( fallbackObj ) ).toThrow();
        expect( () => validate( localeObj ) ).toThrow();
        expect( () => validate( capturingObj ) ).toThrow();
    } );
} );
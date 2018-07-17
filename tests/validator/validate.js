const should = require('chai').should(); // eslint-disable-line no-unused-vars

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

suite( 'lib/validator/validate', function() {

    test( 'Should throw if none options passed', function() {
        ( () => validate() ).should.throw();
    } );

    test( 'Should not throw if typograph or markdown options were not passed', function() {
        const res = validate( { babelfish: optionsObj.babelfish } );

        res.should.to.be.true;
    } );

    test( 'Should throw if babelfish options is not valid', function() {
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

        ( () => validate( fallbackObj ) ).should.throw();
        ( () => validate( localeObj ) ).should.throw();
        ( () => validate( capturingObj ) ).should.throw();
    } );
} );
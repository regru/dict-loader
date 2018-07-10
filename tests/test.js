const should = require('chai').should(); // eslint-disable-line no-unused-vars
const sinon = require('sinon');

const flatten = require('../lib/flatten');
const MdFilter = require('../lib/filters/markdown');
const BemFilter = require('../lib/filters/bem');
const TgFilter = require('../lib/filters/typograf');

const Babelfish = require('babelfish');

suite( 'dict-loader', function() {

    suite( 'flatten()', function() {

        const data = require('./fixtures/simpleInitData');

        test( 'Should join nests keys with dot glue', function() {

            flatten( data, 'ns' ).should.be.eql( {
                'ns.foo'           : 'bar',
                'ns.foo1.bar1'     : 'simple text',
                'ns.foo1.bar2'     : [ 'simple', 'array' ],
                'ns.foo1.bar3.baz' : 'simple text',
            } );

        } );
    } );

    suite( 'filters', function() {

        suite( 'markdown', function() {

            const data = require('./fixtures/complexInitData').mdOnly;
            const mdFilter = new MdFilter();


            test( 'Should markdown string', function() {

                const filtered = flatten( data );

                for ( let key in filtered ) {

                    if ( !/-md/.test( key ) ) {
                        continue;
                    }

                    filtered[ key ] = mdFilter.apply( filtered[ key ] );
                }

                filtered.should.be.eql( {
                    'simple.foo'           : 'bar',
                    'simple.foo1.bar1'     : 'simple text',
                    'simple.foo1.bar2'     : ['simple', 'array'],
                    'simple.foo1.bar3.baz' : 'simple text',
                    'markdown_filter-md'   : 'string with some <strong>bold text</strong>',
                } );
            } );
        } );

        suite( 'bem', function() {

            const data = require('./fixtures/complexInitData');
            const filtersList = require('./fixtures/bemRules');
            const bemFilter = new BemFilter( { filtersList } );

            suite( '#_setOrAddAttr', function() {

                test( 'Should set new class attribute if none anabled', function() {
                    const res = bemFilter._setOrAddAttr( data.bemOnly['simple-bem'], 'p', 'class', 'b-text' );

                    res.should.be.eql('<p class="b-text">Simple paragraph</p>');
                } );

                test( 'Should add class to existed', function() {
                    const res = bemFilter._setOrAddAttr(
                        data.bemOnly['simple_with_class-bem'],
                        'p',
                        'class',
                        'b-text_type_minor'
                    );

                    res.should.be.eql('<p class="b-text b-text_type_minor">Simple paragraph</p>');
                } );

                test( 'Should add boolean attribute', function() {
                    const res = bemFilter._setOrAddAttr( data.bemOnly['simple_input-bem'], 'input', 'checked' );

                    res.should.be.eql('<label><input type="checkbox" checked/>Some label</label>');
                } );

                test( 'Should add attribute', function() {
                    const res = bemFilter._setOrAddAttr( data.bemOnly['simple_div-bem'], 'div', 'data-type', 'double' );

                    res.should.be.eql('<div class="b-block" data-type="double">Block</div>');
                } );

                test( 'Should not duplicate boolean attribute', function() {
                    const res = bemFilter._setOrAddAttr(
                        data.bemOnly['simple_input_duplicated-bem'],
                        'input',
                        'checked'
                    );

                    res.should.be.eql('<label><input type="checkbox" checked/>Some label</label>');
                } );

                test( 'Should not process if condition function returns falsy value', function() {
                    const res = bemFilter._setOrAddAttr(
                        data.bemOnly['simple-bem'],
                        'p',
                        'class',
                        'b-text',
                        () => false
                    );

                    res.should.be.eql('<p>Simple paragraph</p>');
                } );

                test( 'Should process if condition function returns truthly value', function() {
                    const res = bemFilter._setOrAddAttr(
                        data.bemOnly['simple-bem'],
                        'p',
                        'class',
                        'b-text',
                        () => true
                    );

                    res.should.be.eql('<p class="b-text">Simple paragraph</p>');
                } );
            } );

            suite( '#_apply', function() {
                let spy;

                beforeEach( function() {
                    spy = sinon.spy( bemFilter, '_setOrAddAttr' );
                } );

                afterEach( function() {
                    sinon.restore();
                } );

                test( 'Should take tag, attribute and value from specified filter ( case class )', function() {
                    bemFilter._apply( data.bemOnly['simple-bem'] );

                    spy.calledWith( 'p', 'class', filtersList[ 0 ].default.classes.p );
                } );

                test( 'Should take tag, attribute and value from specified filter ( case attrs )', function() {
                    bemFilter._apply( data.bemOnly['simple_input-bem'] );

                    spy.calledWith( 'input', 'checked' );
                } );

                test( 'Should take tag, attribute and value from specified filter ( case ext_ )', function() {
                    bemFilter._apply( data.bemOnly['bem_filter_ext-bem'] );

                    const spyCallRel = spy.getCall( 0 );
                    const spyCallTarget = spy.getCall( 1 );

                    spyCallRel.calledWith( 'a', 'rel', filtersList[ 0 ].default.ext_rel );
                    spyCallTarget.calledWith( 'a', 'target', filtersList[ 0 ].default.ext_target );
                } );
            } );
        } );

        suite( 'typograf', function() {

            const data = require('./fixtures/complexInitData');
            const tgFilter = new TgFilter( {
                locale : 'common',
                rules  : {
                    disabled : [
                        'common/space/afterPunctuation',
                    ],
                },
                htmlEntity : {
                    type : 'name',
                },
            } );

            test( 'Should correct text', function() {

                const filtered = flatten( data.typograf );

                for ( let key in filtered ) {

                    if ( !/-tg/.test( key ) ) {
                        continue;
                    }

                    filtered[ key ] = tgFilter.apply( filtered[ key ] );
                }

                filtered.should.be.eql( { 'text-tg': 'Some text (text) that should be&nbsp;corrected' } );
            } );

            test( 'Should not damage babelfish structure', function() {

                const filtered = flatten( data.typograf2 );
                const l10n = new Babelfish('ru-RU');

                for ( let key in filtered ) {

                    if ( !/-tg/.test( key ) ) {
                        continue;
                    }

                    filtered[ key ] = tgFilter.apply( filtered[ key ] );
                }

                filtered.should.be.eql( {
                    'text-tg'      : '#{count} ((неоплаченный счёт|неоплаченных счёта|неоплаченных счетов)):count',
                    'more_text-tg' : '#{count} ((=0 | |неоплаченных счёта|неоплаченных счетов)):count',
                } );

                l10n.addPhrase( 'ru-RU', 'test', filtered[ 'more_text-tg' ] );

                l10n.t( 'ru-RU', 'test', { count: 0 } ).should.be.equal('0 ');
                l10n.t( 'ru-RU', 'test', { count: 2 } ).should.be.equal('2 неоплаченных счёта');
                l10n.t( 'ru-RU', 'test', { count: 10 } ).should.be.equal('10 неоплаченных счетов');
            } );
        } );
    } );
} );

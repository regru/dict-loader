const flatten = require('../lib/flatten');
const MdFilter = require('../lib/filters/markdown');
const TgFilter = require('../lib/filters/typograf');

const Babelfish = require('babelfish');

describe( 'dict-loader', function() {

    describe( 'filters', function() {

        describe( 'markdown', function() {

            const data = require('./fixtures/complexInitData').mdOnly;
            const mdFilter = new MdFilter();


            it( 'Should markdown string', function() {

                const filtered = flatten( data );

                for ( let key in filtered ) {

                    if ( !/-md/.test( key ) ) {
                        continue;
                    }

                    filtered[ key ] = mdFilter.apply( filtered[ key ] );
                }

                expect( filtered ).toEqual( {
                    'simple.foo'           : 'bar',
                    'simple.foo1.bar1'     : 'simple text',
                    'simple.foo1.bar2'     : ['simple', 'array'],
                    'simple.foo1.bar3.baz' : 'simple text',
                    'markdown_filter-md'   : 'string with some <strong>bold text</strong>',
                } );
            } );
        } );

        describe( 'typograf', function() {

            const data = require('./fixtures/complexInitData');
            const tgFilter = new TgFilter( 'en-US', {
                rules : {
                    disabled : [
                        'common/space/afterPunctuation',
                    ],
                },
                htmlEntity : {
                    type : 'name',
                },
            } );

            it( 'Should correct text', function() {

                const filtered = flatten( data.typograf );

                for ( let key in filtered ) {

                    if ( !/-tg/.test( key ) ) {
                        continue;
                    }

                    filtered[ key ] = tgFilter.apply( filtered[ key ] );
                }

                expect( filtered ).toEqual( { 'text-tg': 'Some text (text) that should be&nbsp;corrected' } );
            } );

            it( 'Should not damage babelfish structure', function() {

                const filtered = flatten( data.typograf2 );
                const l10n = new Babelfish('ru-RU');

                for ( let key in filtered ) {

                    if ( !/-tg/.test( key ) ) {
                        continue;
                    }

                    filtered[ key ] = tgFilter.apply( filtered[ key ] );
                }

                expect( filtered ).toEqual( {
                    'text-tg'      : '#{count} ((неоплаченный счёт|неоплаченных счёта|неоплаченных счетов)):count',
                    'more_text-tg' : '#{count} ((=0 | |неоплаченных счёта|неоплаченных счетов)):count',
                } );

                l10n.addPhrase( 'ru-RU', 'test', filtered[ 'more_text-tg' ] );

                expect( l10n.t( 'ru-RU', 'test', { count: 0 } ) ).toBe('0 ');
                expect( l10n.t( 'ru-RU', 'test', { count: 2 } ) ).toBe('2 неоплаченных счёта');
                expect( l10n.t( 'ru-RU', 'test', { count: 10 } ) ).toBe('10 неоплаченных счетов');
            } );
        } );
    } );
} );

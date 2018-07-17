const should = require('chai').should(); // eslint-disable-line no-unused-vars

const flatten = require('../lib/flatten');
const MdFilter = require('../lib/filters/markdown');
const TgFilter = require('../lib/filters/typograf');

const Babelfish = require('babelfish');

suite( 'dict-loader', function() {

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

        suite( 'typograf', function() {

            const data = require('./fixtures/complexInitData');
            const tgFilter = new TgFilter( 'en_US', {
                rules : {
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

const should = require('chai').should();

const loader = require('../');
const flatten = require('../lib/flatten');
const MdFilter = require('../lib/filters/markdown');
const BemFilter = require('../lib/filters/bem');
const TgFilter = require('../lib/filters/typograf');

suite('dict-loader', function () {

    suite('flatten()', function () {

        const data = require('./fixtures/simpleInitData');

        test('Should join nests keys with dot glue', function() {

            flatten(data, 'ns').should.be.eql({
                'ns.foo': 'bar',
                'ns.foo1.bar1': 'simple text',
                'ns.foo1.bar2': [ 'simple', 'array' ],
                'ns.foo1.bar3.baz': 'simple text',
            });

        });
    });

    suite('filters', function () {

        suite('markdown', function () {

            const data = require('./fixtures/complexInitData').mdOnly;
            const mdFilter = new MdFilter();
            mdFilter.init();


            test('Should markdown string', function () {

                const filtered = flatten(data);

                for (let key in filtered) {

                    if ( !/-md/.test(key) ) {
                        continue;
                    }

                    filtered[ key ] = mdFilter.apply(filtered[ key ]);
                }

                filtered.should.be.eql({
                    'simple.foo': 'bar',
                    'simple.foo1.bar1': 'simple text',
                    'simple.foo1.bar2': ['simple', 'array'],
                    'simple.foo1.bar3.baz': 'simple text',
                    'markdown_filter-md': 'string with some <strong>bold text</strong>',
                });
            });
        });

        suite('bem', function () {

            const data = require('./fixtures/complexInitData').bemOnly;
            const bemFilter = new BemFilter({ filtersList: require('./fixtures/bemRules') });
            bemFilter.init();

            test('Should apply default bem filter ', function () {

                const filtered = flatten(data);

                for (let key in filtered) {

                    if ( !/-bem/.test(key) ) {
                        continue;
                    }

                    filtered[ key ] = bemFilter.apply(filtered[ key ]);
                }

                filtered.should.be.eql({
                    'simple.foo': 'bar',
                    'simple.foo1.bar1': 'simple text',
                    'simple.foo1.bar2': ['simple', 'array'],
                    'simple.foo1.bar3.baz': 'simple text',
                    'bem_filter-bem': 'some link to <a href=\"https://www.reg.ru\" rel=\"nofollow noopener noreferrer\" target=\"_blank\" class=\"b-link b-link__default\">some dest</a>',
                });
            });
        });

        suite('typograf', function () {

            const data = require('./fixtures/complexInitData').typograf;
            const tgFilter = new TgFilter({ locale: 'en-US' });
            tgFilter.init();

            test('Should correct text', function () {

                const filtered = flatten(data);

                for (let key in filtered) {

                    if ( !/-tg/.test(key) ) {
                        continue;
                    }

                    filtered[ key ] = tgFilter.apply(filtered[ key ]);
                }

                filtered.should.be.eql({'text-tg': "Some text (text) that should be&nbsp;corrected"})
            });
        });
    });
});

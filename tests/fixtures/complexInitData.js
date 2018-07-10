const data = require('./simpleInitData');

module.exports = {
    mdOnly : {
        simple               : data,
        'markdown_filter-md' : 'string with some **bold text**',
    },

    bemOnly : {
        'simple-bem'                  : '<p>Simple paragraph</p>',
        'simple_with_class-bem'       : '<p class="b-text">Simple paragraph</p>',
        'simple_input-bem'            : '<label><input type="checkbox"/>Some label</label>',
        'simple_input_duplicated-bem' : '<label><input type="checkbox" checked/>Some label</label>',
        'simple_div-bem'              : '<div class="b-block">Block</div>',
        'bem_filter_ext-bem'          : 'some link to <a href="https://example.com">some dest</a>',
        'bem_filter_int-bem'          : 'some link to <a href="/dest/url">some dest</a>',
    },

    typograf : {
        'text-tg' : 'Some text ( text ) that should be corrected',
    },

    typograf2 : {
        'text-tg'      : '#{count} ((неоплаченный счёт|неоплаченных счёта|неоплаченных счетов)):count',
        'more_text-tg' : '#{count} ((=0 | |неоплаченных счёта|неоплаченных счетов)):count',
    },

    complex : {
        simple                  : data,
        'complex_filter-bem-md' : 'some link to [some dest](#{value})',
    },
};
const data = require('./simpleInitData');

module.exports = {
    mdOnly: {
        simple: data,
        'markdown_filter-md': 'string with some **bold text**',
    },

    bemOnly: {
        simple: data,
        'bem_filter-bem': 'some link to <a href="https://www.reg.ru">some dest</a>',
    },

    typograf: {
        'text-tg': 'Some text ( text ) that should be corrected',
    },

    typograf2: {
        'text-tg': '#{count} ((неоплаченный счёт|неоплаченных счёта|неоплаченных счетов)):count',
        'more_text-tg': '#{count} ((=0 | |неоплаченных счёта|неоплаченных счетов)):count',
    },

    complex: {
        simple: data,
        'complex_filter-bem-md': 'some link to [some dest](#{value})',
    },
};
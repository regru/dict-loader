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

    complex: {
        simple: data,
        'complex_filter-bem-md': 'some link to [some dest](#{value})',
    },
};
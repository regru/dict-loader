const Typographer = require('typograf');

const BaseFilter = require('./baseFilter');

class TgFilter extends BaseFilter {
    constructor(options) {
        super(options);

        this.options.locale = options.locale === 'ru' ? 'ru' : 'common';
    }

    init() {
        this.tg = new Typographer(this.options);
    }

    _apply(text) {
        return this.tg.execute(text);
    }
}

module.exports = TgFilter;

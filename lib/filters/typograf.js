const Typographer = require('typograf');

const BaseFilter = require('./baseFilter');

class TgFilter extends BaseFilter {

    init() {
        const locale = this.options.locale === 'ru' ? 'ru' : 'common';
        const tg = this.tg = new Typographer({ locale });

        if (this.options.disabled) {
            tg.disableRule(this.options.disabled);
        }

        if (this.options.enabled) {
            tg.enableRule(this.options.enabled);
        }
    }

    _apply(text) {
        return this.tg.execute(text).replace(/\u00a0/g, "&nbsp;");
    }
}

module.exports = TgFilter;

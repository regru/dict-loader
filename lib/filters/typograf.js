const Typographer = require('typograf');
const omit = require('object.omit');
const get = require('lodash.get');

const BaseFilter = require('./baseFilter');

class TgFilter extends BaseFilter {
    constructor(options) {
        super(options);

        this.options.locale = options.locale === 'ru' ? 'ru' : 'common';
    }

    _processRules(rule, action ) {
        this.tg[`${action}Rule`](rule);
    }

    init() {
        const rules = get(this.options, 'rules', {});
        this.tg = new Typographer( omit(this.options, 'rules') );

        if (rules.disabled) {
            rules.disabled.forEach(rule => {
                this._processRules(rule, 'disable');
            });
        }

        if (rules.enabled) {
            rules.enabled.forEach(rule => {
                this._processRules(rule, 'enable');
            });
        }
    }

    _apply(text) {
        return this.tg.execute(text);
    }
}

module.exports = TgFilter;

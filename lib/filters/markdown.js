const Markdown = require('markdown-it');

const plugin = require('./plugins/babelfish');
const BaseFilter = require('./baseFilter');

class MdFilter extends BaseFilter {

    init() {
        const md = this.md = Markdown(this.options);

        md.use(plugin);
    }

    _apply(text) {
        return this.md.render(text);
    }
}

module.exports = MdFilter;

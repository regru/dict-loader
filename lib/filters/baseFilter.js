class Filter {
    constructor(options) {
        this.options = options;
    }

    init() {
        throw new Error('Init method should be redefined');
    }

    _apply() {
        throw new Error('Apply method should be redefined');
    }

    apply(content) {

        if ( !Array.isArray(content) ) {
            return this._apply(content);
        }

        return content.map( item => this._apply(item) );
    }
}


module.exports = Filter;

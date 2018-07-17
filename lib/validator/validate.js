const Ajv = require('ajv');
const { options, babelfish } = require('./schema');

const ajv = new Ajv();

ajv.addKeyword(
    'isRegEx',
    {
        compile : function() {
            return function( data ) {
                return data instanceof RegExp;
            };

        },
    }
);

ajv.addKeyword(
    'containsCapturing',
    {
        compile : function() {
            return function( data ) {
                return /^(?:[^{}\d\w+[\].?*]+)?\(.+?\)(.+)?\$?\/\w?$/.test( data );
            };

        },
    }
);

ajv.addSchema( babelfish );


module.exports = function( optionObject = {} ) {
    const validate = ajv.compile( options );
    const result = validate( optionObject );

    if ( !result ) {
        throw new Error( validate.errors[0].message );
    }

    return result;
};
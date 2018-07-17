module.exports.options = {
    $id        : '/Options',
    type       : 'object',
    properties : {
        babelfish : {
            $ref : '/Babelfish',
        },
        typograph : {
            type : 'object',
        },
        markdown : {
            type : 'object',
        },
    },
    required : [
        'babelfish',
    ],
};

module.exports.babelfish = {
    $id        : '/Babelfish',
    type       : 'object',
    properties : {
        fallback : {
            type : 'string',
        },
        testNamespace : {
            type     : 'object',
            isRegExp : true,
            containsCapturing : true,
        },
        testLocale : {
            type    : 'object',
            isRegExp : true,
            containsCapturing : true,
        },
    },
    required : [
        'fallback',
        'testNamespace',
        'testLocale',
    ],
};

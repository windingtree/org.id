module.exports = {
    'extends': 'eslint:recommended',
    'env': {
        'es6': true,
        'browser': true,
        'node': true,
        'mocha': true,
        'jest': true
    },
    'globals': {
        'artifacts': false,
        'contract': false,
        'assert': false,
        'web3': false
    },
    'parserOptions': {
        'ecmaVersion': 8
    },
    'rules': {

        // Strict mode
        'strict': 0,

        // Code style
        'indent': ['error', 4, {
            'SwitchCase': 1
        }],
        'quotes': [2, 'single'],
        'semi': ['error', 'always'],
        'space-before-function-paren': ['error', 'always'],
        'no-use-before-define': 0,
        'eqeqeq': [2, 'smart'],
        'dot-notation': [2, {
            'allowKeywords': true,
            'allowPattern': ''
        }],
        'no-redeclare': [2, {
            'builtinGlobals': true
        }],
        'no-trailing-spaces': [2, {
            'skipBlankLines': true
        }],
        'eol-last': 1,
        'comma-spacing': [2, {
            'before': false,
            'after': true
        }],
        'camelcase': 0,
        'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
        'comma-dangle': [1, 'only-multiline'],
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-debugger': 0,
        'no-undef': 2,
        'one-var': [0],
        'object-curly-spacing': [2, 'always'],
        'generator-star-spacing': ['error', 'before'],
        'padded-blocks': 0,
        'no-unused-expressions': 0,
        'arrow-body-style': 0,
        'no-extra-semi': 0
    }
};

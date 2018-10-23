const RESTRICTED_GLOBALS = require('./restricted_globals')

module.exports = {
  parser: 'babel-eslint',

  plugins: [
    'mocha',
    'babel',
    'react',
    'import',
    'no-unsanitized',
    'prefer-object-spread',
  ],

  env: {
    es6: true,
    node: true,
    mocha: true,
    browser: true,
  },

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: { experimentalObjectRestSpread: true },
  },

  rules: {
    'block-scoped-var': 'error',
    camelcase: [ 'error', { properties: 'never' } ],
    'comma-dangle': 'off',
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': [ 'error', 'last' ],
    'consistent-return': 'off',
    curly: [ 'error', 'multi-line' ],
    'dot-location': [ 'error', 'property' ],
    'dot-notation': [ 'error', { allowKeywords: true } ],
    eqeqeq: [ 'error', 'allow-null' ],
    'guard-for-in': 'error',
    indent: [ 'error', 2, { SwitchCase: 1 } ],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'max-len': [ 'error', 140, 2, { ignoreComments: true, ignoreUrls: true } ],
    'new-cap': [ 'error', { capIsNewExceptions: [ 'Private' ] } ],
    'no-bitwise': 'off',
    'no-caller': 'error',
    'no-cond-assign': 'off',
    'no-const-assign': 'error',
    'no-debugger': 'error',
    'no-dynamic-require': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-parens': 'off',
    'no-extra-semi': [ 'error' ],
    'no-global-assign': 'error',
    'no-irregular-whitespace': 'error',
    'no-iterator': 'error',
    'no-loop-func': 'error',
    'no-multi-spaces': 'off',
    'no-multi-str': 'off',
    'no-nested-ternary': 'error',
    'no-new': 'off',
    'no-path-concat': 'off',
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-restricted-globals': ['error', ...RESTRICTED_GLOBALS],
    'no-return-assign': 'off',
    'no-script-url': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-underscore-dangle': 'off',
    'no-unsanitized/method': 'error',
    'no-unsanitized/property': 'error',
    'no-unused-expressions': 'off',
    'no-unused-vars': [ 'error' ],
    'no-use-before-define': [ 'error', 'nofunc' ],
    'no-var': 'error',
    'no-with': 'error',
    'one-var': [ 'error', 'never' ],
    'prefer-const': 'error',
    quotes: [ 'error', 'single', { allowTemplateLiterals: true } ],
    'semi-spacing': [ 'error', { before: false, after: true } ],
    semi: [ 'error', 'always' ],
    'space-before-blocks': [ 'error', 'always' ],
    'space-before-function-paren': [ 'error', { anonymous: 'always', named: 'never' } ],
    'space-in-parens': [ 'error', 'never' ],
    'space-infix-ops': [ 'error', { int32Hint: false } ],
    'space-unary-ops': [ 'error' ],
    strict: [ 'error', 'never' ],
    'valid-typeof': 'error',
    'wrap-iife': [ 'error', 'outside' ],
    yoda: 'off',

    'object-curly-spacing': 'off', // overridden with babel/object-curly-spacing
    'babel/object-curly-spacing': [ 'error', 'always' ],

    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-uses-react': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
    'react/no-danger': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-wrap-multilines': ['error', {
      declaration: true,
      assignment: true,
      return: true,
      arrow: true,
    }],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-indent': ['error', 2],
    'react/no-will-update-set-state': 'error',
    'react/no-is-mounted': 'error',
    'react/no-multi-comp': ['error', { ignoreStateless: true }],
    'react/no-unknown-property': 'error',
    'react/prefer-es6-class': ['error', 'always'],
    'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
    'react/no-unescaped-entities': 'error',

    'mocha/handle-done-callback': 'error',
    'mocha/no-exclusive-tests': 'error',

    'import/no-unresolved': [ 'error', { 'amd': true, 'commonjs': true } ],
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-duplicates': 'error',

    'prefer-object-spread/prefer-object-spread': 'error',
  }
}

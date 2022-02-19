module.exports = {
  extends: ['./base.js'],
  overrides: [
    {
      env: { browser: true, es6: true, node: true },
      extends: [
        './base.js',
        'standard-with-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:import/typescript',
      ],
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['prettier', '@typescript-eslint'],
      rules: {
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/strict-boolean-expressions': 'off',
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-returns-type': 'off',
        'prettier/prettier': [
          'error',
          {
            semi: false,
            singleQuote: true,
          },
        ],
        semi: 'off',
        // this currently prevents tree-shaken imports like "date-fns/addSeconds"
        'import/no-duplicates': 'off',

        // this prevents the issue in a Typescript friendly way
        '@typescript-eslint/no-duplicate-imports': ['error'],

        '@typescript-eslint/no-floating-promises': 0,
        'import/no-named-as-default-member': 0,
        'import/no-named-as-default': 0,
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/member-delimiter-style': 0,
        '@typescript-eslint/space-before-function-paren': 0,
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
}

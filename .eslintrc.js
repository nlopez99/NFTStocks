module.exports = {
  extends: [
    '@trident-core/eslint-config/es6',
    '@trident-core/eslint-config/typescript',
  ],
  settings: {
    'import/external-module-folders': ['node_modules'],
    'import/resolver': {
      alias: {
        map: [['@', './src/']],
        extensions: ['.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'new-cap': 'off',
      },
      parserOptions: {
        ecmaVersion: 2020,
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
  ],
}

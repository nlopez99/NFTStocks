module.exports = {
  extends: ['@trident-core/eslint-config/es6', '@trident-core/eslint-config/typescript'],
  settings: {
    'import/external-module-folders': ['node_modules'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        ecmaVersion: 2020,
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        sourceType: 'module',
      },
    },
  ],
}
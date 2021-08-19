const path = require('path');
module.exports = {
    root: true,
    env: {
        node: true,
        es2020: true,
    },
    plugins: ['@typescript-eslint', 'prettier', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
    ],
    settings: {
        'import/resolver': {
            node: {
                paths: ['.'],
            },
            typescript:{
                "alwaysTryTypes": true
            }
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
        tsconfigRootDir: '.',
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['**/*.spec.ts', '**/*.test.ts'],
            env: {
                jest: true,
            },
            plugins: ['jest'],
        },
    ],
    reportUnusedDisableDirectives: true,
    rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
    },
};

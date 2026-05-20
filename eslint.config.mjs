// @ts-check
import { createRequire } from 'module';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

// eslint-config-expo is CommonJS; bridge to ESM via createRequire
const require = createRequire(import.meta.url);
const expo = require('eslint-config-expo/flat.js');

export default [
  ...expo,
  prettierConfig,

  // ─── General rules (all source files + app entrypoints) ──────────────────
  {
    files: ['src/**/*.{ts,tsx}', 'App.tsx', 'index.ts'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // ─── Boundary: domain is framework-free and depends on nothing ────────────
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react', 'react-native', 'react-native/*'],
              message: 'domain is framework-free',
            },
            { group: ['expo', 'expo-*'], message: 'domain is framework-free' },
            { group: ['axios'], message: 'domain defines contracts, not transport' },
            { group: ['@tanstack/*'], message: 'cache belongs to infrastructure/presentation' },
            {
              group: ['@application/*', '@infrastructure/*', '@presentation/*'],
              message: 'domain is the innermost layer',
            },
          ],
        },
      ],
    },
  },

  // ─── Boundary: application orchestrates domain only ───────────────────────
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react-native', 'react-native/*'], message: 'application is UI-free' },
            { group: ['axios'], message: 'transport lives in infrastructure' },
            { group: ['@tanstack/*'], message: 'cache lives in presentation/infrastructure' },
            {
              group: [
                '@presentation/*',
                '@infrastructure/repositories/*',
                '@infrastructure/http/*',
              ],
              message: 'use cases receive repositories via DI',
            },
          ],
        },
      ],
    },
  },

  // ─── Boundary: presentation consumes use cases via hooks ──────────────────
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['axios'],
              message: 'never call HTTP directly; use a hook backed by a use case',
            },
            {
              group: ['@react-native-async-storage/async-storage'],
              message: 'storage is an infra detail; wrap behind a repository',
            },
            {
              group: ['@infrastructure/repositories/*', '@infrastructure/http/*'],
              message: 'use DI container, not concrete implementations',
            },
          ],
        },
      ],
    },
  },

  // ─── Tests can violate boundaries (need mocks/fakes) ──────────────────────
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // ─── Ignored paths ─────────────────────────────────────────────────────────
  {
    ignores: ['node_modules', '.expo', 'ios', 'android', 'coverage', 'babel.config.js'],
  },
];

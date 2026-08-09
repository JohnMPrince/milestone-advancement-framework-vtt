import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: {
        game: 'readonly',
        Hooks: 'readonly',
        CONFIG: 'readonly',
        foundry: 'readonly',
        ui: 'readonly',
        canvas: 'readonly',
        CONST: 'readonly',
        Dialog: 'readonly',
        ChatMessage: 'readonly',
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
);

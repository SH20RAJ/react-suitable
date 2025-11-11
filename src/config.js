function createDefaultConfig() {
  return {
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    extends: [
      'eslint:recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: [
      'unused-imports',
      '@typescript-eslint'
    ],
    rules: {
      // Unused imports and variables - main focus
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Common fixable issues
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',

      // Import/Export rules
      'no-duplicate-imports': 'error'
    }
  };
}

function createReactConfig() {
  const baseConfig = createDefaultConfig();
  
  return {
    ...baseConfig,
    extends: [
      ...baseConfig.extends,
      'plugin:react/recommended',
      'plugin:react-hooks/recommended'
    ],
    plugins: [
      ...baseConfig.plugins,
      'react',
      'react-hooks'
    ],
    rules: {
      ...baseConfig.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  };
}

function createNextJsConfig() {
  const reactConfig = createReactConfig();
  
  return {
    ...reactConfig,
    extends: [
      ...reactConfig.extends,
      'next/core-web-vitals'
    ]
  };
}

module.exports = {
  createDefaultConfig,
  createReactConfig,
  createNextJsConfig
};
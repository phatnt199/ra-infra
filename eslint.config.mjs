import confs from '@minimaltech/eslint-react';

const configs = [
  ...confs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

export default configs;

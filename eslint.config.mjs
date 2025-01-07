import confs from '@minimaltech/eslint-react';

const configs = [
  ...confs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default configs;

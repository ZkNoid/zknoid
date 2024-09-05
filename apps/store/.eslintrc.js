module.exports = {
  extends: ['next', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'react', 'import'],
  rules: {
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
  },
};

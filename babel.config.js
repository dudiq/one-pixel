module.exports = {
  presets: [
    ['@babel/preset-env'],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['module-resolver', {
      root: ['./'],
      alias: {
        '@': './src',
      },
    }],
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};

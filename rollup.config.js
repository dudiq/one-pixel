import path from 'path';

import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';

import pkg from './package.json';

// const { getEnv } = require('./env');

function resolveDir(dir) {
  return path.join(__dirname, '', dir);
}

function resolveFile(file) {
  return path.resolve(__dirname, file);
}

// const ENV = getEnv(process.env.NODE_ENV);

const withSourceMaps = process.env.NODE_ENV !== 'production';

const outputConf = {
  exports: 'named',
  sourcemap: withSourceMaps,
};

const createConf = ({ input, output }) => ({
  input,
  // external: [...Object.keys(pkg.dependencies)],
  plugins: [
    json(),
    resolve({
      preferBuiltins: false,
    }),
    alias({
      '@': resolveDir('./src'),
      resolve: ['.js', '/index.js'],
    }),
    babel({
      // runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    // replace({
    //   ENV: JSON.stringify(ENV),
    // }),
    commonjs({
      include: /node_modules/,
    }),
    !withSourceMaps && terser(),
  ],
  watch: {
    exclude: ['node_modules/**'],
  },
  output,
});

export default [
  createConf({
    input: resolveFile('./src/one-pixel.js'),
    output: [
      {
        ...outputConf,
        file: resolveFile(pkg.main),
        name: pkg.name,
        format: 'umd',
      },
      {
        ...outputConf,
        file: resolveFile(pkg.module),
        format: 'esm',
      },
    ],
  }),

  createConf({
    input: resolveFile('./src/Plugins/Editor/index.js'),
    output: [
      {
        ...outputConf,
        file: resolveFile('./dist/plugin-editor-umd.js'),
        name: 'one-pixel-editor',
        format: 'umd',
      },
      {
        ...outputConf,
        file: resolveFile('./dist/plugin-editor-esm.js'),
        format: 'esm',
      },
    ],
  }),
];

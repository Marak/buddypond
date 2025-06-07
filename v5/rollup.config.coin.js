// rollup.config.coin.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import path from 'path';

export default [
  // JS build
  {
    input: 'apps/based/coin/coin.js',
    output: {
      file: 'dist/apps/based/coin.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      terser(),
    ],
  },

  // CSS build (dummy entry)
  {
    input: 'apps/based/coin/coin-style.js',
    output: {
      file: 'dist/apps/dummy-css.js', // unused output
      format: 'es',
    },
    plugins: [
      postcss({
        extract: path.resolve('dist/apps/based/coin.css'),
        minimize: true,
        sourceMap: true,
      }),
    ],
  }
];

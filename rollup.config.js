import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const isProd = process.env.NODE_ENV === 'production';
const extensions = ['.js', '.ts', '.jsx', '.tsx'];

export default {
  input: [
    './src/index.tsx'
  ],
  output: {
    file: isProd ? './dist/app.js' : './public/app.js',
    format: 'iife',
    sourcemap: !isProd
  },
  plugins: [
    commonjs({
      include: /node_modules/,
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
       }
    }),
    resolve({
      extensions,
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    scss({
      processor: () => postcss([autoprefixer()]),
      output: isProd ? './dist/app.css' : './public/app.css'
    }),
    inject({
      React: 'react'
    }),
    html({
      fileName: 'index.html',
      title: 'FourBlock - Shameless Web3 FourSquare knock-off',
      template: ({ files, title }) => {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="stylesheet" href="./app.css">
</head>
<body>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>
`;
      },
    }),
    (isProd && terser()),
    (!isProd && serve({
      host: 'localhost',
      port: 3000,
      open: true,
      contentBase: ['public'],
    })),
    (!isProd && livereload({
      watch: 'public',
    })),
    // visualizer({
    //   filename: 'bundle-analysis.html',
    //   open: true,
    // }),
  ]
};

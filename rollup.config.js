import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import json from '@rollup/plugin-json'
import url from '@rollup/plugin-url'

import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import yaml from 'js-yaml'
import fs from 'fs'

const { mapBoxToken } = yaml.load(fs.readFileSync('./secrets.yml', 'utf8'))

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
        mapBoxToken: mapBoxToken,
        replaceContractAddress: '0x97Cb929629b897ef48CC468893d4eF0952566C09'
       }
    }),
    json({
      compact: isProd,
      namedExports: true
    }),
    resolve({
      extensions,
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    scss({
      processor: () => postcss([autoprefixer()]),
      output: isProd ? './dist/app.css' : './public//app.css'
    }),
    url({
      // Where to put files
      destDir: 'dist/images/',
      // Path to put infront of files (in code)
      publicPath: process.env.NODE_ENV === "development"
      ? 'http://localhost:8000/dist/images/'
      : '/images/',
      // File name once copied
      fileName: '[name][extname]',
      // Kinds of files to process
      include: [
        '**/*.svg',
        '**/*.png',
        '**/*.gif',
        '**/*.jpg',
        '**/*.jpeg',
      ]
    }),
    inject({
      React: 'react'
    }),
    html({
      fileName: 'index.html',
      title: 'FourBlock -  Location Check-In dApp',
      template: ({ files, title }) => {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
  <link rel="stylesheet" href="/app.css">
</head>
<body>
  <div id="app"></div>
  <script src="/app.js"></script>
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

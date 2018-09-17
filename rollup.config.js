import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonJS from 'rollup-plugin-commonjs';
import hypothetical from 'rollup-plugin-hypothetical';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import cleanup from 'rollup-plugin-cleanup';
const cloneDeep = require('lodash.clonedeep');

const main = 'src/clearroad.ts';
const typescriptOptions = {
  typescript: require('typescript'),
  importHelpers: true
};
const libs = ['jIO', 'RSVP', 'Rusha', 'Ajv'];

const iife = {
  input: main,
  output: [{
    file: 'dist/iife/clearroad.js',
    format: 'iife',
    name: 'bundle',
    banner: `(function(${libs.join(', ')}) {
`,
    footer: `
  window.ClearRoad = bundle.ClearRoad;
})(${libs.map(lib => `window.${lib}`).join(', ')});
    `
  }],
  plugins: [
    typescript(typescriptOptions),
    hypothetical({
      allowFallthrough: true
    }),
    resolve(),
    commonJS({
      include: 'node_modules/**'
    }),
    replace({
      delimiters: ['', ''],
      values: {
        "var Queue = require('rsvp').Queue;": 'var Queue = RSVP.Queue;',
        "var all = require('rsvp').all;": 'var all = RSVP.all;',
        "var Rusha = require('rusha');": '',
        "var jIO = require('jio').jIO;": '',
        "var Ajv = require('ajv');": ''
      }
    }),
    buble(),
    cleanup({
      comments: 'none',
      extensions: ['js', 'jsx', 'ts', 'tsx']
    })
  ]
};

const iifeMinified = cloneDeep(iife);
iifeMinified.output[0].file = 'dist/iife/clearroad.min.js';
iifeMinified.plugins.push(uglify());

export default [
  iife,
  iifeMinified
];

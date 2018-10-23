import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonJS from 'rollup-plugin-commonjs';
import hypothetical from 'rollup-plugin-hypothetical';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
const cloneDeep = require('lodash.clonedeep');

const main = 'src/clearroad.ts';
const typescriptOptions = {
  typescript: require('typescript')
};
const libs = ['jIO', 'RSVP', 'Rusha', 'Ajv'].join(', ');

const iife = {
  input: main,
  output: [{
    file: 'dist/iife/clearroad.js',
    format: 'iife',
    name: 'bundle',
    banner: `(function(${libs}) {
`,
    footer: `window.ClearRoad = bundle.ClearRoad;
})(${libs});
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
        "var Rusha = require('rusha');": '',
        "var jIO = require('../node/lib/jio.js').jIO;": '',
        "var Ajv = require('ajv');": ''
      }
    }),
    buble()
  ]
};

const iifeMinified = cloneDeep(iife);
iifeMinified.output[0].file = 'dist/iife/clearroad.min.js';
iifeMinified.plugins.push(uglify());

export default [
  iife,
  iifeMinified
];

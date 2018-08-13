import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import hypothetical from 'rollup-plugin-hypothetical';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
const cloneDeep = require('lodash.clonedeep');

const cjs = {
  external: [
    'rsvp',
    'jio'
  ],
  input: 'src/clearroad.js',
  output: {
    file: 'clearroad.js',
    format: 'cjs'
  },
  plugins: [
    builtins(),
    commonJS({
      include: 'node_modules/**'
    })
  ]
};

const iife = {
  input: 'src/clearroad.js',
  output: [{
    file: 'dist/clearroad.js',
    format: 'iife',
    name: 'bundle',
    banner: `
(function(jIO) {
`,
    footer: `
  for (var i in bundle) {
    if (bundle.hasOwnProperty(i)) {
      window[i] = bundle[i];
    }
  }
})(jIO);
    `,
    globals: {
      rsvp: 'RSVP',
      jio: 'jIO'
    }
  }],
  plugins: [
    hypothetical({
      allowFallthrough: true,
      files: {
        jio: `
export { jIO };
        `,
        rsvp: `
export default window.RSVP;
        `
      }
    }),
    resolve(),
    commonJS({
      include: 'node_modules/**'
    }),
    buble()
  ]
};

const iifeMinified = cloneDeep(iife);
iifeMinified.output[0].file = 'dist/clearroad.min.js';
iifeMinified.plugins.push(uglify());

export default [
  cjs,
  iife,
  iifeMinified
];

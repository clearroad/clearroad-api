import { expect } from 'chai';
import 'mocha';

import * as Ajv from 'ajv';
import { readdirSync } from 'fs';
import { resolve, extname } from 'path';

const definition = file => require(resolve(__dirname, '../../definitions', file));
const data = file => require(resolve(__dirname, file));
const files = readdirSync(__dirname).filter(file => extname(file) === '.json');

describe('samples', () => {
  files.forEach(file => {
    describe(file, () => {
      it('should validate the sample', () => {
        const ajv = new Ajv({
          allErrors: true
        });
        const validate = ajv.compile(definition(file));
        const valid = validate(data(file));
        expect(valid).to.be.equal(true);
      });
    });
  });
});

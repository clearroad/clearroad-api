import * as Ajv from 'ajv';

import { validateDefinition } from './';
import { definitions } from './definitions';

describe('validateDefinition', () => {
  const type: any = 'custom';
  let validate: jasmine.Spy;

  beforeEach(() => {
    validate = jasmine.createSpy('validate');
    spyOn(Ajv.prototype, 'errorsText').and.returnValue('');
    spyOn(Ajv.prototype, 'compile').and.returnValue(validate);
  });

  describe('when the definition does NOT exist', () => {
    beforeEach(() => {
      (definitions as any)[type] = undefined;
    });

    it('should throw an error', () => {
      expect(() => validateDefinition(type, {})).toThrow(new Error(`portal_type: "${type}" not found`));
    });
  });

  describe('when the definition exist', () => {
    beforeEach(() => {
      (definitions as any)[type] = {};
    });

    describe('when the schema is valid', () => {
      beforeEach(() => {
        validate.and.returnValue(true);
      });

      it('should validate against the schema', () => {
        expect(validateDefinition(type, {})).toBeTruthy();
      });
    });

    describe('when the schema is NOT valid', () => {
      beforeEach(() => {
        validate.and.returnValue(false);
      });

      it('should throw an error', () => {
        expect(() => validateDefinition(type, {})).toThrow(new Error('Validation schema failed:\n'));
      });
    });
  });
});

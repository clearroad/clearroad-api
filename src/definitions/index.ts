const Ajv = require('ajv');

import { portalType } from '../message-types';

export type definitionPropertyType = 'object'|'array'|'string'|'integer'|'number';

export interface IDefinitionProperty {
  $id?: string;
  type?: definitionPropertyType;
  $ref?: string;
  $comment?: string;
  description?: string;
  title?: string;
}

export interface IDefinitionNumber extends IDefinitionProperty {
  type: 'integer'|'number';
  default?: number;
  examples?: number[];
}

export interface IDefinitionString extends IDefinitionProperty {
  type: 'string';
  default?: string;
  enum?: string[];
  examples?: string[];
  pattern?: string;
}

export interface IDefinitionObject extends IDefinitionProperty {
  type: 'object';
  properties: IDefinitionProperties;
  required?: string[];
}

export interface IDefinitionArray extends IDefinitionProperty {
  type: 'array';
  items: IDefinitionObject;
}

export interface IDefinitionProperties {
  [key: string]: IDefinitionObject|IDefinitionArray|IDefinitionString|IDefinitionNumber|IDefinitionProperty;
}

export interface IDefinition extends IDefinitionObject {
  $id?: string;
  definitions?: IDefinitionProperties;
  $schema: string;
}

import { definitions } from './definitions';

export const validateDefinition = (type: portalType, data: any) => {
  const definition = definitions[type];

  // check type
  if (!definition) {
    throw new Error(`portal_type: "${type}" not found`);
  }

  const ajv = new Ajv({
    allErrors: true
  });
  const validate = ajv.compile(definition);
  const valid = validate(data);
  if (!valid) {
    throw new Error(`Validation schema failed:\n${ajv.errorsText(validate.errors)}`);
  }
  return valid;
};

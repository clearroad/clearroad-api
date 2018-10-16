import { IDefinition } from './index';
const json: IDefinition = {
  type: 'object',
  definitions: {
    datetime: {
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}T ?[0-9]{2}:[0-9]{2}:[0-9]{2}(Z|[+-][0-9]{4})?$',
      type: 'string',
      examples: [
        '2018-04-01T00:00:00Z'
      ]
    }
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  required: [
    'account_manager',
    'data_collector',
    'condition',
    'cert_id',
    'account_reference',
    'effective_date',
    'fuel_consumption',
    'fuel_taxable',
    'obu_reference',
    'vehicle_reference',
    'product_line',
    'portal_type'
  ],
  properties: {
    account_manager: {
      type: 'string',
      description: 'The reference should be of an account manager that already exists in ClearRoad Platform.',
      examples: [
        'testamref'
      ]
    },
    data_collector: {
      type: 'string',
      description: 'The reference should be of a data provider that already exists in ClearRoad Platform.',
      examples: [
        'testmpref'
      ]
    },
    condition: {
      type: 'string',
      description: 'Sale Trade Condition to apply. The reference should be of an object that already exists in ClearRoad Platform.',
      examples: [
        'test-stc-1'
      ]
    },
    cert_id: {
      type: 'string',
      description: 'The DOT certificate ID value',
      examples: [
        '1051'
      ]
    },
    account_reference: {
      type: 'string',
      description: 'The reference of the road account to be defined.',
      examples: [
        'USER000011'
      ]
    },
    effective_date: {
      $ref: '#/definitions/datetime',
      description: 'The start date of the customer account. Could not be left empty. Should be in UTC.'
    },
    expiration_date: {
      $ref: '#/definitions/datetime',
      description: 'The stop date of the customer account. Could be left empty - the road account will have no expiration date. Should be in UTC.'
    },
    fuel_consumption: {
      type: 'string',
      description: 'Combined EPA Miles Per Gallon (MPG) rating for the vehicle.',
      examples: [
        '12.0'
      ]
    },
    fuel_taxable: {
      type: 'string',
      description: 'Boolean defining if customer is subject to taxable fuel.',
      examples: [
        '1'
      ]
    },
    obu_reference: {
      type: 'string',
      description: 'An object for this on board unit will be created in the ClearRoad platform if it is nor already present.',
      pattern: '^[0-9a-z]{24}$',
      examples: [
        '977298026d50a5b1795c6563'
      ]
    },
    vehicle_reference: {
      type: 'string',
      description: 'An onject for this vehicle will be created in the ClearRoad Platform if it is not already present.',
      pattern: '^[0-9A-Z]{17}$',
      examples: [
        '2C1MR2295T6789740'
      ]
    },
    product_line: {
      type: 'string',
      description: 'The reporting method the customer choosed to use.',
      enum: [
        'odometer_message_no_transaction',
        'odometer_message_transaction',
        'ruc_metrics',
        'service'
      ],
      examples: [
        'ruc_metrics'
      ]
    },
    portal_type: {
      type: 'string',
      description: 'The type of the message in the ClearRoad Platform. Only one value is possible.',
      default: 'Road Account Message',
      enum: [
        'Road Account Message'
      ],
      examples: [
        'Road Account Message'
      ]
    }
  }
};
export default json;

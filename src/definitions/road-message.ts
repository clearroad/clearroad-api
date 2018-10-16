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
    'request',
    'portal_type'
  ],
  properties: {
    request: {
      type: 'object',
      required: [
        'description',
        'vehicle_reference',
        'obu_reference',
        'type',
        'transaction_date',
        'mileage_details'
      ],
      properties: {
        description: {
          type: 'string',
          description: 'The description of the reported mileage',
          examples: [
            'Mileage data'
          ]
        },
        vehicle_reference: {
          description: 'The Vehicle Identification Number of the vehicle for which the message is reported.',
          type: 'string',
          pattern: '^[0-9A-Z]{17}$',
          examples: [
            '1GTG6BE38F1262119'
          ]
        },
        obu_reference: {
          type: 'string',
          description: 'The On Board Unit reference of the device for which the message is reported',
          pattern: '^[0-9a-z]{24}$',
          examples: [
            '977298026d50a5b1795c6563'
          ]
        },
        type: {
          type: 'string',
          description: 'A value to indicate the type of message. Can be one of: ADJ: Adjusted mileage transaction, CRE: Credit transaction, FEE: Fees transaction, INV: Invoicing transaction, MRP: Reported mileage transaction',
          examples: [
            'MRP'
          ]
        },
        transaction_date: {
          description: 'The date at which mileage was traveled. Should be in UTC.',
          $ref: '#/definitions/datetime'
        },
        mileage_details: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fuel_price: {
                type: 'number',
                description: 'The price of the fuel consumed at the transaction date.',
                default: 0,
                examples: [
                  -0.30000001192092896
                ]
              },
              fuel_quantity: {
                type: 'number',
                description: 'The quantity of fuel consumed at the transaction date.',
                default: 0,
                examples: [
                  0.14000000059604645
                ]
              },
              miles_price: {
                type: 'number',
                description: 'The price of miles traveled.',
                default: 0,
                examples: [
                  0.014999999664723873
                ]
              },
              miles_quantity: {
                type: 'number',
                description: 'The number of miles traveled.',
                default: 0,
                examples: [
                  3.700000047683716
                ]
              },
              rule_id: {
                type: 'integer',
                description: 'An identifier associated with a geographic area, or zone, in which a specific rate per mile will be assessed for miles traveled.  FIPS codes are used to identify states.',
                default: 0,
                examples: [
                  41
                ]
              },
              sub_rule_id: {
                type: 'integer',
                description: '0 if the travel was on public roads, 1 if it was on private roads',
                default: 0,
                examples: [
                  1
                ]
              }
            }
          }
        }
      }
    },
    portal_type: {
      type: 'string',
      description: 'The type of message in the ClearRoad Platform. Only one type possible',
      default: 'Road Message',
      enum: [
        'Road Message'
      ],
      examples: [
        'Road Message'
      ]
    }
  }
};
export default json;

import { IDefinition } from './index';
const json: IDefinition = {
  type: 'object',
  definitions: {
    datetime: {
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}T ?[0-9]{2}:[0-9]{2}:[0-9]{2}(Z|[+-][0-9]{4})?$',
      type: 'string',
      examples: [
        '2017-01-02T14:21:20Z'
      ]
    }
  },
  $schema: 'http://json-schema.org/draft-07/schema#',
  required: [
    'report_type',
    'billing_period_reference',
    'request_date',
    'portal_type'
  ],
  properties: {
    report_type: {
      type: 'string',
      title: 'Report Type',
      description: 'The type of the requested report',
      enum: [
        'AccountBalance'
      ],
      $comment: 'So far there is only one type of request possible.',
      examples: [
        'AccountBalance'
      ]
    },
    billing_period_reference: {
      type: 'string',
      title: 'Billing Period Reference',
      description: 'The reference of the billing period. The billing period should already exist in the system.',
      examples: [
        '2018Q1'
      ]
    },
    request_date: {
      $ref: '#/definitions/datetime',
      title: 'Request Date',
      description: 'The datetime for which the request is made'
    },
    request: {
      type: 'string',
      title: 'Request',
      description: ''
    },
    portal_type: {
      type: 'string',
      title: 'Portal Type',
      description: 'The type of the object in the ClearRoad ERP5 instance. Only one possible value.',
      default: 'Road Report Request',
      enum: [
        'Road Report Request'
      ],
      examples: [
        'Road Report Request'
      ]
    }
  }
};
export default json;

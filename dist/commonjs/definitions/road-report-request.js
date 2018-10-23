"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json = {
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
        'report_type',
        'billing_period_reference',
        'request_date',
        'portal_type'
    ],
    properties: {
        report_type: {
            type: 'string',
            description: 'The type of the requested report.',
            enum: [
                'AccountBalance'
            ],
            examples: [
                'AccountBalance'
            ]
        },
        billing_period_reference: {
            type: 'string',
            description: 'The reference of the billing period. The billing period should already exist in the ClearRoad Platform.',
            examples: [
                '2018Q1'
            ]
        },
        request_date: {
            description: 'The datetime for which the request is made. Should be in UTC.',
            $ref: '#/definitions/datetime'
        },
        request: {
            type: 'string',
            description: 'Used to give specific parameters to report if needed. This filed could be left empty for an AccountBalance report.'
        },
        portal_type: {
            type: 'string',
            description: 'The type of the object in the ClearRoad Platform. Only one possible value.',
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
exports.default = json;

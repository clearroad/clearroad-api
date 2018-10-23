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
        'reference',
        'start_date',
        'stop_date',
        'portal_type'
    ],
    properties: {
        reference: {
            type: 'string',
            description: 'The reference given to the new billing period which will be used to reference it in the future.',
            examples: [
                '2018Q1'
            ]
        },
        start_date: {
            description: 'The date, starting which, the billing period is going to be active. Should be in UTC.',
            $ref: '#/definitions/datetime'
        },
        stop_date: {
            description: 'The date, starting which, the billing period will become inactive. Should be UTC. If it is left empty, the billing period will never turn inactive, once activated.',
            $ref: '#/definitions/datetime'
        },
        portal_type: {
            type: 'string',
            description: 'The type of message in the ClearRoad Platform. Only one value is possible',
            default: 'Billing Period Message',
            enum: [
                'Billing Period Message'
            ],
            examples: [
                'Billing Period Message'
            ]
        }
    }
};
exports.default = json;

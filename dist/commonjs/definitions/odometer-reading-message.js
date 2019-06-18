"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json = {
    type: 'object',
    definitions: {
        datetime: {
            pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}T ?[0-9]{2}:[0-9]{2}:[0-9]{2}(Z|[+-][0-9]{4})?$',
            type: 'string',
            examples: [
                '2018-05-01T00:00:00Z'
            ]
        }
    },
    $schema: 'http://json-schema.org/draft-07/schema#',
    required: [
        'data_collector',
        'account_manager',
        'vehicle_reference',
        'odometer_reading',
        'effective_date',
        'portal_type'
    ],
    properties: {
        data_collector: {
            type: 'string',
            description: 'The name of the entity which was used to provide the odometer data. Usually, it is the data collector.',
            examples: [
                'testmpref'
            ]
        },
        account_manager: {
            type: 'string',
            description: 'The name of the entity which provided the odometer data. Usually it is the account manager',
            examples: [
                'testamref'
            ]
        },
        message_verification: {
            type: 'string',
            description: 'The legislation could require that, from time to time, a special agent verifies the correctness of the message. This field is reserved for the identifier of the verifier, if the verification took place.'
        },
        vehicle_reference: {
            type: 'string',
            description: 'The Vehicle Identification Number (VIN) of the vehicle whose odometer is being reported.',
            examples: [
                '1GTG6BE38F1262119'
            ]
        },
        odometer_reading: {
            description: 'Value of Odometer Reading',
            type: 'number',
            examples: [
                456
            ]
        },
        effective_date: {
            $ref: '#/definitions/datetime',
            description: 'Timestamp when the odometer reading was captured.'
        },
        portal_type: {
            type: 'string',
            description: 'The type of the message in the ClearRoad Platform. Only one value is possible.',
            default: 'Odometer Reading Message',
            enum: [
                'Odometer Reading Message'
            ],
            examples: [
                'Odometer Reading Message'
            ]
        }
    }
};
exports.default = json;

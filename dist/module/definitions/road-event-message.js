const json = {
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
            required: [
                'vehicle_reference',
                'obu_reference',
                'event_details'
            ],
            type: 'object',
            properties: {
                vehicle_reference: {
                    type: 'string',
                    description: 'The Vehicle Identification Number of the road account registration for which the event is reported',
                    examples: [
                        '1GTG6BE38F1262119'
                    ]
                },
                obu_reference: {
                    type: 'string',
                    description: 'The On Board Unit reference of the road account registration for which the event is reported',
                    examples: [
                        '977298026d50a5b1795c6563'
                    ]
                },
                event_details: {
                    description: 'The details of the event that is reported.',
                    type: 'array',
                    items: {
                        type: 'object',
                        required: [
                            'type',
                            'date'
                        ],
                        properties: {
                            type: {
                                type: 'integer',
                                description: 'The ID of the event. Every type has it own ID.',
                                examples: [
                                    12
                                ]
                            },
                            date: {
                                $ref: '#/definitions/datetime',
                                description: 'The datetime of the event. Should be a UTC time.'
                            }
                        }
                    }
                }
            }
        },
        portal_type: {
            type: 'string',
            description: 'The type of the object in ClearRoad Platform. Only one value is possible.',
            default: 'Road Event Message',
            enum: [
                'Road Event Message'
            ],
            examples: [
                'Road Event Message'
            ]
        }
    }
};
export default json;
//# sourceMappingURL=road-event-message.js.map
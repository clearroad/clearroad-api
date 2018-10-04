const json = {
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
                    title: 'Vehicle Reference',
                    type: 'string',
                    description: 'The Vehicle Identification Number of the road account registration for which the event is reported',
                    pattern: '^[0-9A-Z]{17}$',
                    examples: [
                        '1GTG6BE38F1262119'
                    ]
                },
                obu_reference: {
                    type: 'string',
                    title: 'On Board Unit Reference',
                    description: 'The On Board Unit reference of the road account registration for which the event is reported',
                    pattern: '^[0-9a-z]{24}$',
                    examples: [
                        '977298026d50a5b1795c6563'
                    ]
                },
                event_details: {
                    title: 'Event Details',
                    description: 'The details of the event that is reported',
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
                                description: 'The ID of the event ',
                                default: 0,
                                examples: [
                                    12
                                ]
                            },
                            date: {
                                $ref: '#/definitions/datetime',
                                description: 'The datetime of the event. Should be a UTC time.',
                                $comment: 'Should we accept the timezone in the pattern if the time is in UTC?'
                            }
                        }
                    }
                }
            }
        },
        portal_type: {
            type: 'string',
            title: 'Portal Type',
            description: 'The type of the object in ClearRoad ERP5 instance. Only one possible value.',
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
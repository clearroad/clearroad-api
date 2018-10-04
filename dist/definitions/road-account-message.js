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
            title: 'The Account Manager Reference',
            default: '',
            description: 'The reference should be of an account manager that already exists in ERP5.',
            examples: [
                'testamref'
            ]
        },
        data_collector: {
            type: 'string',
            title: 'The Data Collector Reference',
            description: 'The reference should be of a data provider that already exists in ERP5.',
            default: '',
            examples: [
                'testmpref'
            ]
        },
        condition: {
            type: 'string',
            title: 'The Applicable Sale Trade Condition reference',
            description: 'The reference should be of a sale trade condition that already exists in ERP5.',
            default: '',
            examples: [
                'test-stc-1'
            ]
        },
        cert_id: {
            type: 'string',
            title: 'The DOT certificate ID value',
            default: '',
            examples: [
                '1051'
            ]
        },
        account_reference: {
            type: 'string',
            title: 'The customer account reference ',
            description: 'The reference of the road account to be defined.',
            default: '',
            examples: [
                'USER000011'
            ]
        },
        effective_date: {
            $ref: '#/definitions/datetime',
            title: 'The start date of the customer account.',
            description: 'Could not be left empty.',
            default: ''
        },
        expiration_date: {
            $ref: '#/definitions/datetime',
            title: 'The stop date of the customer account',
            description: 'Could be left empty - the road account will have no expiration date.',
            default: ''
        },
        fuel_consumption: {
            type: 'string',
            title: 'The EPA value of the vehicle',
            default: '',
            examples: [
                '12.0'
            ]
        },
        fuel_taxable: {
            type: 'string',
            title: 'Boolean defining if customer is subject to taxable fuel',
            default: '',
            examples: [
                '1'
            ]
        },
        obu_reference: {
            type: 'string',
            title: 'The On Board Unit reference',
            description: 'An onject for this on board unit will be created in the ERP5 instance.',
            default: '',
            examples: [
                '123456789MRDID'
            ]
        },
        vehicle_reference: {
            type: 'string',
            title: 'The vehicle VIN Number ',
            description: 'An onject for this vehicle will be created in the ERP5 instance.',
            default: '',
            examples: [
                '2C1MR2295T6789740'
            ]
        },
        product_line: {
            type: 'string',
            title: 'The reporting method the customer choosed to use',
            default: '',
            examples: [
                'ruc_metrics'
            ]
        },
        portal_type: {
            type: 'string',
            title: 'The type of the message.',
            description: 'Only one type is possible.',
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
//# sourceMappingURL=road-account-message.js.map
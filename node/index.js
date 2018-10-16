'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var RSVP = _interopDefault(require('rsvp'));
var Rusha = _interopDefault(require('rusha'));

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

var json$1 = {
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

var json$2 = {
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
                    pattern: '^[0-9A-Z]{17}$',
                    examples: [
                        '1GTG6BE38F1262119'
                    ]
                },
                obu_reference: {
                    type: 'string',
                    description: 'The On Board Unit reference of the road account registration for which the event is reported',
                    pattern: '^[0-9a-z]{24}$',
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
                                default: 0,
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

var json$3 = {
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

var json$4 = {
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

var definitions = {
    'Billing Period Message': json,
    'Road Account Message': json$1,
    'Road Event Message': json$2,
    'Road Message': json$3,
    'Road Report Request': json$4
};

var Ajv = require('ajv');
var validateDefinition = function (type, data) {
    var definition = definitions[type];
    // check type
    if (!definition) {
        throw new Error("portal_type: \"" + type + "\" not found");
    }
    var ajv = new Ajv({
        allErrors: true
    });
    var validate = ajv.compile(definition);
    var valid = validate(data);
    if (!valid) {
        throw new Error("Validation schema failed:\n" + ajv.errorsText(validate.errors));
    }
    return valid;
};

var jIO = require('./lib/jio.js').jIO;
var queryPortalType = 'portal_type';
var PortalTypes;
(function (PortalTypes) {
    PortalTypes["BillingPeriodMessage"] = "Billing Period Message";
    PortalTypes["File"] = "File";
    PortalTypes["RoadAccount"] = "Road Account";
    PortalTypes["RoadAccountMessage"] = "Road Account Message";
    PortalTypes["RoadEvent"] = "Road Event";
    PortalTypes["RoadEventMessage"] = "Road Event Message";
    PortalTypes["RoadMessage"] = "Road Message";
    PortalTypes["RoadReportRequest"] = "Road Report Request";
    PortalTypes["RoadTransaction"] = "Road Transaction";
})(PortalTypes || (PortalTypes = {}));
var queryPortalTypes = [
    "\"" + PortalTypes.BillingPeriodMessage + "\"",
    "\"" + PortalTypes.RoadAccountMessage + "\"",
    "\"" + PortalTypes.RoadEventMessage + "\"",
    "\"" + PortalTypes.RoadMessage + "\" ",
    "\"" + PortalTypes.RoadReportRequest + "\""
].join(' OR ');
var ValidationStates;
(function (ValidationStates) {
    ValidationStates["Processed"] = "processed";
    ValidationStates["Rejected"] = "rejected";
    // TODO: submitted does not work yet
    // Submitted = 'submitted'
})(ValidationStates || (ValidationStates = {}));
var queryValidationStates = Object.keys(ValidationStates)
    .map(function (key) { return ValidationStates[key]; }).map(function (val) { return "\"" + val + "\""; }).join(' OR ');
var database = 'clearroad';
var jsonIdRec = function (keyValueSpace, key, value, deep) {
    if (deep === void 0) { deep = 0; }
    var res;
    if (value && typeof value.toJSON === 'function') {
        value = value.toJSON();
    }
    if (Array.isArray(value)) {
        res = [];
        for (var i = 0; i < value.length; i += 1) {
            res[res.length] = jsonIdRec(keyValueSpace, i, value[i], deep + 1);
            if (res[res.length - 1] === undefined) {
                res[res.length - 1] = 'null';
            }
        }
        if (res.length === 0) {
            return '[]';
        }
        return "[" + res.join(', ') + "]";
    }
    if (typeof value === 'object' && value !== null) {
        res = Object.keys(value);
        res.sort();
        for (var i = 0, l = res.length; i < l; i += 1) {
            key = res[i];
            res[i] = jsonIdRec(keyValueSpace, key, value[key], deep + 1);
            if (res[i] !== undefined) {
                res[i] = JSON.stringify(key) + ": " + keyValueSpace + res[i];
            }
            else {
                res.splice(i, 1);
                l -= 1;
                i -= 1;
            }
        }
        if (res.length === 0) {
            return '{}';
        }
        return "{" + res.join(', ');
    }
    return JSON.stringify(value);
};
var jsonId = function (value) {
    return jsonIdRec('', '', value);
};
var merge = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        if (obj1.hasOwnProperty(attrname)) {
            obj3[attrname] = obj1[attrname];
        }
    }
    for (var attrname in obj2) {
        if (obj2.hasOwnProperty(attrname)) {
            obj3[attrname] = obj2[attrname];
        }
    }
    return obj3;
};
var joinQueries = function (queries, joinType) {
    if (joinType === void 0) { joinType = 'AND'; }
    return queries.filter(function (query) { return !!query; }).join(" " + joinType + " ");
};
var ClearRoad = /** @class */ (function () {
    /**
     * Instantiate a ClearRoad api instance.
     * @param url ClearRoad API url
     * @param accessToken ClearRoad API access token (required when using Node)
     * @param options Override default options
     */
    function ClearRoad(url, accessToken, options) {
        if (options === void 0) { options = {}; }
        this.url = url;
        this.accessToken = accessToken;
        this.options = options;
        this.useLocalStorage = false;
        if (!options.localStorage || !options.localStorage.type) {
            options.localStorage = {
                type: 'indexeddb'
            };
        }
        this.localStorageType = options.localStorage.type;
        if (this.localStorageType === 'dropbox' || this.localStorageType === 'gdrive') {
            options.localStorage = {
                type: 'drivetojiomapping',
                sub_storage: {
                    type: this.localStorageType,
                    access_token: options.localStorage.accessToken
                }
            };
        }
        else {
            this.useLocalStorage = true;
        }
        this.initMessagesStorage();
        this.initIngestionReportStorage();
        this.initDirectoryStorage();
        this.initReportStorage();
    }
    /**
     * @internal
     */
    ClearRoad.prototype.queryMaxDate = function () {
        // only retrieve the data since xxx
        if (this.options.maxDate) {
            var from = new Date(this.options.maxDate);
            return "modification_date: >= \"" + from.toJSON() + "\"";
        }
        return '';
    };
    /**
     * @internal
     */
    ClearRoad.prototype.localSubStorage = function (key) {
        switch (this.localStorageType) {
            case 'dropbox':
            case 'gdrive':
                return {
                    type: 'mapping',
                    sub_storage: {
                        type: 'query',
                        sub_storage: this.options.localStorage
                    },
                    mapping_dict: {
                        portal_type: ['equalSubProperty', key]
                    }
                };
            case 'memory':
                return {
                    type: 'query',
                    sub_storage: {
                        type: 'memory'
                    }
                };
            case 'indexeddb':
                return {
                    type: 'query',
                    sub_storage: {
                        type: 'indexeddb',
                        database: database
                    }
                };
            default:
                return merge({}, this.options.localStorage);
        }
    };
    /**
     * @internal
     */
    ClearRoad.prototype.signatureSubStorage = function (db) {
        switch (this.localStorageType) {
            case 'dropbox':
            case 'gdrive':
            case 'memory':
                return {
                    type: 'query',
                    sub_storage: {
                        type: 'memory'
                    }
                };
            case 'indexeddb':
                return {
                    type: 'query',
                    sub_storage: {
                        type: 'indexeddb',
                        database: db
                    }
                };
            default:
                return merge(this.options.localStorage, {
                    database: db
                });
        }
    };
    /**
     * @internal
     */
    ClearRoad.prototype.initMessagesStorage = function () {
        var refKey = 'source_reference';
        var query = joinQueries([
            queryPortalType + ":(" + queryPortalTypes + ")",
            'grouping_reference:"data"',
            this.queryMaxDate()
        ]);
        var signatureStorage = this.signatureSubStorage(database + "-messages-signatures");
        var localStorage = this.localSubStorage(refKey);
        this.messagesStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: signatureStorage,
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: true,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            local_sub_storage: localStorage,
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url: this.url,
                    default_view_reference: 'jio_view',
                    access_token: this.accessToken
                }
            }
        });
    };
    /**
     * @internal
     */
    ClearRoad.prototype.initIngestionReportStorage = function () {
        var refKey = 'destination_reference';
        var query = joinQueries([
            queryPortalType + ":(" + queryPortalTypes + ")",
            "validation_state:(" + queryValidationStates + ")",
            this.queryMaxDate()
        ]);
        var signatureStorage = this.signatureSubStorage(database + "-ingestion-signatures");
        var localStorage = this.localSubStorage(refKey);
        this.ingestionReportStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: signatureStorage,
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            local_sub_storage: localStorage,
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url: this.url,
                    default_view_reference: 'jio_ingestion_report_view',
                    access_token: this.accessToken
                }
            }
        });
    };
    /**
     * @internal
     */
    ClearRoad.prototype.initDirectoryStorage = function () {
        var refKey = 'source_reference';
        var query = joinQueries([queryPortalType + ":(" + [
                "\"" + PortalTypes.RoadAccount + "\"",
                "\"" + PortalTypes.RoadEvent + "\"",
                "\"" + PortalTypes.RoadTransaction + "\""
            ].join(' OR ') + ')', this.queryMaxDate()]);
        var signatureStorage = this.signatureSubStorage(database + "-directory-signatures");
        var localStorage = this.localSubStorage(refKey);
        this.directoryStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: signatureStorage,
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 200]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            local_sub_storage: localStorage,
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url: this.url,
                    default_view_reference: 'jio_directory_view',
                    access_token: this.accessToken
                }
            }
        });
    };
    /**
     * @internal
     */
    ClearRoad.prototype.initReportStorage = function () {
        var refKey = 'reference';
        var query = joinQueries([
            queryPortalType + ":(\"" + PortalTypes.File + "\")",
            this.queryMaxDate()
        ]);
        var signatureStorage = this.signatureSubStorage(database + "-files-signatures");
        var localStorage = this.localSubStorage(refKey);
        var mappingStorageWithEnclosure = merge(localStorage, {
            attachment_list: ['data'],
            attachment: {
                data: {
                    get: { uri_template: 'enclosure' },
                    put: { uri_template: 'enclosure' }
                }
            }
        });
        this.reportStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: 'source_reference',
            signature_sub_storage: this.useLocalStorage ? signatureStorage : merge(mappingStorageWithEnclosure, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', 'source_reference']
                }
            }),
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            check_remote_attachment_creation: true,
            check_remote_attachment_modification: false,
            check_remote_attachment_deletion: true,
            check_local_attachment_creation: false,
            check_local_attachment_modification: false,
            check_local_attachment_deletion: false,
            local_sub_storage: this.useLocalStorage ? localStorage : merge(mappingStorageWithEnclosure, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                attachment_list: ['data'],
                attachment: {
                    data: {
                        get: {
                            uri_template: this.url + "/{+id}/Base_downloadWithCors"
                        },
                        put: {
                            erp5_put_template: this.url + "/{+id}/Base_edit"
                        }
                    }
                },
                sub_storage: {
                    type: 'erp5',
                    url: this.url,
                    default_view_reference: 'jio_report_view',
                    access_token: this.accessToken
                }
            }
        });
    };
    /**
     * Post a message to the ClearRoad API.
     * If not currently connected, messages will be put in the local storage and sent later when using `.sync()`
     * @param data The message
     */
    ClearRoad.prototype.post = function (data) {
        var _this = this;
        validateDefinition(data.portal_type, data);
        var options = merge({}, data);
        switch (data.portal_type) {
            case PortalTypes.RoadAccountMessage:
                options.parent_relative_url = 'road_account_message_module';
                break;
            case PortalTypes.RoadEventMessage:
                options.parent_relative_url = 'road_event_message_module';
                break;
            case PortalTypes.RoadMessage:
                options.parent_relative_url = 'road_message_module';
                break;
            case PortalTypes.BillingPeriodMessage:
                options.parent_relative_url = 'billing_period_message_module';
                break;
            case PortalTypes.RoadReportRequest:
                options.parent_relative_url = 'road_report_request_module';
                break;
        }
        options.grouping_reference = 'data';
        var dataAsString = jsonId(options);
        var rusha = new Rusha();
        var reference = rusha.digestFromString(dataAsString);
        options.source_reference = reference;
        options.destination_reference = reference;
        var queue = new RSVP.Queue();
        return queue.push(function () {
            return _this.messagesStorage.put(options.source_reference, options);
        });
    };
    /**
     * Synchronize local data and API data:
     *  - send local data to API if not present yet
     *  - retrieve API data in your local storage
     * @param progress Function to get notified of progress. There are 4 storages to sync.
     */
    ClearRoad.prototype.sync = function (progress) {
        var _this = this;
        if (progress === void 0) { progress = function () { }; }
        var queue = new RSVP.Queue();
        return queue
            .push(function () {
            return _this.messagesStorage.repair().push(function () { return progress('messages'); });
        })
            .push(function () {
            return _this.ingestionReportStorage.repair().push(function () { return progress('ingestion-reports'); });
        })
            .push(function () {
            return _this.directoryStorage.repair().push(function () { return progress('directories'); });
        })
            .push(function () {
            return _this.reportStorage.repair().push(function () { return progress('reports'); });
        });
    };
    /**
     * Query for documents in the local storage. Make sure `.sync()` is called before.
     * @param options Query options. If none set, return all documents.
     */
    ClearRoad.prototype.allDocs = function (options) {
        return this.messagesStorage.allDocs(options);
    };
    /**
     * Get a report using the Report Request reference
     * @param sourceReference The reference of the Report Request
     */
    ClearRoad.prototype.getReportFromRequest = function (sourceReference) {
        var _this = this;
        return this.allDocs({
            query: queryPortalType + ":\"" + PortalTypes.File + "\"",
            select_list: ['source_reference', 'reference']
        }).push(function (result) {
            var report = result.data.rows.find(function (row) { return row.value.source_reference === sourceReference; });
            if (report) {
                return _this.getReport(report.value.reference);
            }
            return {};
        });
    };
    /**
     * Get a report using the reference.
     * If you do not have the Report reference, use `getReportFromRequest` with the Report Request reference instead.
     * @param reference The reference of the Report
     */
    ClearRoad.prototype.getReport = function (reference) {
        if (this.useLocalStorage) {
            return this.reportStorage.getAttachment(reference, 'data');
        }
        return this.reportStorage.allAttachments(reference);
    };
    return ClearRoad;
}());

exports.jIO = jIO;
exports.ClearRoad = ClearRoad;

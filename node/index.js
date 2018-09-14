'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var RSVP = _interopDefault(require('rsvp'));
var Rusha = _interopDefault(require('rusha'));

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
var ClearRoad = /** @class */ (function () {
    /**
     * Instantiate a ClearRoad api instance.
     * @param url ClearRoad API url
     * @param accessToken ClearRoad API access token (required when using Node)
     * @param options Override default options
     */
    function ClearRoad(url, accessToken, options) {
        if (options === void 0) { options = {}; }
        this.useLocalStorage = false;
        if (!options.localStorage || !options.localStorage.type) {
            options.localStorage = {
                type: 'indexeddb'
            };
        }
        var localStorageOptions = options.localStorage;
        if (localStorageOptions.type === 'dropbox' || localStorageOptions.type === 'gdrive') {
            localStorageOptions = {
                type: 'drivetojiomapping',
                sub_storage: {
                    type: localStorageOptions.type,
                    access_token: localStorageOptions.accessToken
                }
            };
        }
        this.useLocalStorage = localStorageOptions.type === 'indexeddb';
        var localSubStorage = {
            type: 'query',
            sub_storage: {
                type: 'indexeddb',
                database: database
            }
        };
        var mappingSubStorage = {
            type: 'mapping',
            sub_storage: {
                type: 'query',
                sub_storage: localStorageOptions
            }
        };
        var signatureSubStorage = {
            type: this.useLocalStorage ? 'indexeddb' : 'memory'
        };
        // only retrieve the data since xxx
        var queryMaxDate = '';
        if (options.maxDate) {
            var from = new Date(options.maxDate);
            queryMaxDate = " AND modification_date: >= \"" + from.toJSON() + "\"";
        }
        var refKey = 'source_reference';
        var query = queryPortalType + ":(" + queryPortalTypes + ") AND grouping_reference:\"data\"" + queryMaxDate;
        this.messagesStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: database + "-messages-signatures"
                })
            },
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
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingSubStorage, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_view',
                    access_token: accessToken
                }
            }
        });
        refKey = 'destination_reference';
        query = queryPortalType + ":(" + queryPortalTypes + ") AND validation_state:(" + queryValidationStates + ")" + queryMaxDate;
        this.ingestionReportStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: database + "-ingestion-signatures"
                })
            },
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
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingSubStorage, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_ingestion_report_view',
                    access_token: accessToken
                }
            }
        });
        refKey = 'source_reference';
        query = queryPortalType + ":(" + [
            "\"" + PortalTypes.RoadAccount + "\"",
            "\"" + PortalTypes.RoadEvent + "\"",
            "\"" + PortalTypes.RoadTransaction + "\""
        ].join('OR') + ')' + queryMaxDate;
        this.directoryStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: database + "-directory-signatures"
                })
            },
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
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingSubStorage, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_directory_view',
                    access_token: accessToken
                }
            }
        });
        refKey = 'reference';
        query = queryPortalType + ":(\"" + PortalTypes.File + "\")" + queryMaxDate;
        var mappingStorageWithEnclosure = merge(mappingSubStorage, {
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
            signature_sub_storage: this.useLocalStorage ? {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: database + "-files-signatures"
                })
            } : merge(mappingStorageWithEnclosure, {
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
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingStorageWithEnclosure, {
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
                            uri_template: url + "/{+id}/Base_downloadWithCors"
                        },
                        put: {
                            erp5_put_template: url + "/{+id}/Base_edit"
                        }
                    }
                },
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_report_view',
                    access_token: accessToken
                }
            }
        });
    }
    /**
     * Post a message to the ClearRoad API.
     * If not currently connected, messages will be put in the local storage and sent later when using `.sync()`
     * @param data The message
     */
    ClearRoad.prototype.post = function (data) {
        var _this = this;
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

exports.ClearRoad = ClearRoad;

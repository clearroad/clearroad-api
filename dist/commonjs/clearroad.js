"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rusha = require('rusha');
var jIO = require('jio').jIO;
var index_1 = require("./definitions/index");
var queue_1 = require("./queue");
var storage_1 = require("./storage");
/**
 * Query key for `PortalTypes`
 */
exports.queryPortalType = 'portal_type';
/**
 * Each message is represented by a "portal_type" (or message category)
 */
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
})(PortalTypes = exports.PortalTypes || (exports.PortalTypes = {}));
var queryPortalTypes = [
    "\"" + PortalTypes.BillingPeriodMessage + "\"",
    "\"" + PortalTypes.RoadAccountMessage + "\"",
    "\"" + PortalTypes.RoadEventMessage + "\"",
    "\"" + PortalTypes.RoadMessage + "\"",
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
/**
 * Query key for `GroupingReferences`
 */
exports.queryGroupingReference = 'grouping_reference';
var GroupingReferences;
(function (GroupingReferences) {
    /**
     * Message created locally
     * @internal
     */
    GroupingReferences["Data"] = "data";
    /**
     * Message created on the ClearRoad Platform
     */
    GroupingReferences["Report"] = "report";
})(GroupingReferences = exports.GroupingReferences || (exports.GroupingReferences = {}));
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
var maxLogLevel = 1000;
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
        this.databaseName = options.localStorage.database || 'clearroad';
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
        var _a;
        if (this.options.useQueryStorage) {
            return {
                type: 'query',
                sub_storage: merge({}, this.options.localStorage)
            };
        }
        switch (this.localStorageType) {
            case 'dropbox':
            case 'gdrive':
                return {
                    type: 'mapping',
                    sub_storage: {
                        type: 'query',
                        sub_storage: merge({}, this.options.localStorage)
                    },
                    mapping_dict: (_a = {},
                        _a[exports.queryPortalType] = ['equalSubProperty', key],
                        _a)
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
                        database: this.databaseName
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
        if (this.options.useQueryStorage) {
            return {
                type: 'query',
                sub_storage: merge(this.options.localStorage, {
                    database: db
                })
            };
        }
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
            exports.queryPortalType + ": (" + queryPortalTypes + ")",
            exports.queryGroupingReference + ": \"" + GroupingReferences.Data + "\"",
            this.queryMaxDate()
        ]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-messages-signatures");
        var localStorage = this.localSubStorage(refKey);
        this.messagesStorage = jIO.createJIO({
            report_level: maxLogLevel,
            debug: this.options.debug,
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
            exports.queryPortalType + ": (" + queryPortalTypes + ")",
            "validation_state: (" + queryValidationStates + ")",
            this.queryMaxDate()
        ]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-ingestion-signatures");
        var localStorage = this.localSubStorage(refKey);
        this.ingestionReportStorage = jIO.createJIO({
            report_level: maxLogLevel,
            debug: this.options.debug,
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
        var query = joinQueries([exports.queryPortalType + ": (" + [
                "\"" + PortalTypes.RoadAccount + "\"",
                "\"" + PortalTypes.RoadEvent + "\"",
                "\"" + PortalTypes.RoadTransaction + "\""
            ].join(' OR ') + ")", this.queryMaxDate()]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-directory-signatures");
        var localStorage = this.localSubStorage(refKey);
        this.directoryStorage = jIO.createJIO({
            report_level: maxLogLevel,
            debug: this.options.debug,
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
        var _a, _b, _c, _d;
        var refKey = 'reference';
        var query = joinQueries([
            exports.queryPortalType + ": (\"" + PortalTypes.File + "\")",
            this.queryMaxDate()
        ]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-files-signatures");
        var localStorage = this.localSubStorage(refKey);
        var mappingStorageWithEnclosure = merge(localStorage, {
            attachment_list: [storage_1.defaultAttachmentName],
            attachment: (_a = {},
                _a[storage_1.defaultAttachmentName] = {
                    get: { uri_template: 'enclosure' },
                    put: { uri_template: 'enclosure' }
                },
                _a)
        });
        this.reportStorage = jIO.createJIO({
            report_level: maxLogLevel,
            debug: this.options.debug,
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: 'source_reference',
            signature_sub_storage: this.useLocalStorage ? signatureStorage : merge(mappingStorageWithEnclosure, {
                mapping_dict: (_b = {},
                    _b[exports.queryPortalType] = ['equalSubProperty', 'source_reference'],
                    _b)
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
                mapping_dict: (_c = {},
                    _c[exports.queryPortalType] = ['equalSubProperty', refKey],
                    _c)
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                attachment_list: [storage_1.defaultAttachmentName],
                attachment: (_d = {},
                    _d[storage_1.defaultAttachmentName] = {
                        get: {
                            uri_template: this.url + "/{+id}/Base_downloadWithCors"
                        },
                        put: {
                            erp5_put_template: this.url + "/{+id}/Base_edit"
                        }
                    },
                    _d),
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
        index_1.validateDefinition(data[exports.queryPortalType], data);
        var options = merge({}, data);
        switch (data[exports.queryPortalType]) {
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
        // jIO only support string values
        if ('request' in data) {
            options.request = JSON.stringify(data.request);
        }
        options[exports.queryGroupingReference] = GroupingReferences.Data;
        var rusha = new Rusha();
        var reference = rusha.digestFromString(jsonId(options));
        options.source_reference = reference;
        options.destination_reference = reference;
        return queue_1.getQueue().push(function () {
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
        return queue_1.getQueue()
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
     * @return Search results
     */
    ClearRoad.prototype.allDocs = function (options) {
        return this.messagesStorage.allDocs(options);
    };
    /**
     * Get a report using the Report Request reference
     * @param sourceReference The reference of the Report Request
     * @return The report as JSON
     */
    ClearRoad.prototype.getReportFromRequest = function (sourceReference) {
        var _this = this;
        return this.allDocs({
            query: exports.queryPortalType + ": \"" + PortalTypes.File + "\" AND source_reference: \"" + sourceReference + "\"",
            select_list: ['reference']
        }).push(function (result) {
            var report = result.data.rows[0];
            if (report) {
                return _this.getReport(report.value.reference);
            }
            return null;
        });
    };
    /**
     * Get a report using the reference.
     * If you do not have the Report reference, use `getReportFromRequest` with the Report Request reference instead.
     * @param reference The reference of the Report
     * @return The report as JSON
     */
    ClearRoad.prototype.getReport = function (reference) {
        var _this = this;
        return queue_1.getQueue()
            .push(function () {
            return _this.reportStorage.getAttachment(reference, storage_1.defaultAttachmentName);
        })
            .push(function (report) {
            var _a;
            return _a = {},
                _a[storage_1.defaultAttachmentName] = report,
                _a;
        }, function () {
            return _this.reportStorage.allAttachments(reference);
        })
            .push(function (attachment) { return jIO.util.readBlobAsText(attachment[storage_1.defaultAttachmentName]); })
            .push(function (report) { return report.target.result ? JSON.parse(report.target.result) : {}; });
    };
    return ClearRoad;
}());
exports.ClearRoad = ClearRoad;

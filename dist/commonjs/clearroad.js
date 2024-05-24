"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rusha = require('rusha');
var jIO = require('jio').jIO;
var all = require('rsvp').all;
var index_1 = require("./definitions/index");
var message_types_1 = require("./message-types");
var queue_1 = require("./queue");
var storage_1 = require("./storage");
/**
 * Query key for `PortalTypes`
 */
exports.queryPortalType = 'portal_type';
var defaultMessagePortalTypes = [
    message_types_1.PortalTypes.BillingPeriodMessage,
    message_types_1.PortalTypes.OdometerReadingMessage,
    message_types_1.PortalTypes.RoadEventMessage,
    message_types_1.PortalTypes.RoadMessage,
    message_types_1.PortalTypes.RoadReportRequest,
    message_types_1.PortalTypes.RoadMileageMessage
];
var defaultMessagePortalType = message_types_1.PortalTypes.RoadAccountMessage;
var defaultDirectoryPortalType = message_types_1.PortalTypes.RoadAccount;
var queryPortalTypes = function (types) {
    return types.map(function (type) { return "\"" + type + "\""; }).join(' OR ');
};
/**
 * When a message is processed by the ClearRoad platform, it will create a new message with a validation state.
 */
var ValidationStates;
(function (ValidationStates) {
    /**
     * Message has been processed by the ClearRoad platform.
     */
    ValidationStates["Processed"] = "processed";
    /**
     * Message has been rejected by the ClearRoad platform. A `comment` will be added explaining the reason.
     */
    ValidationStates["Rejected"] = "rejected";
    /**
     * Message has been submitted to the ClearRoad platform but still processing.
     */
    ValidationStates["Submitted"] = "submitted";
    /**
     * When the message has not been sent to the ClearRoad platform yet, the state is "not_processed".
     */
    ValidationStates["Unprocessed"] = "not_processed";
})(ValidationStates = exports.ValidationStates || (exports.ValidationStates = {}));
var queryValidationStates = [
    "\"" + ValidationStates.Processed + "\"",
    "\"" + ValidationStates.Rejected + "\""
    // TODO: submitted does not work yet
    // `"${ValidationStates.Submitted}"`
].join(' OR ');
/**
 * Query key for `GroupingReferences`
 */
exports.queryGroupingReference = 'grouping_reference';
var GroupingReferences;
(function (GroupingReferences) {
    /**
     * Message created in the local storage.
     * @internal
     */
    GroupingReferences["Data"] = "data";
    /**
     * Message created on the ClearRoad platform.
     */
    GroupingReferences["Report"] = "report";
})(GroupingReferences = exports.GroupingReferences || (exports.GroupingReferences = {}));
exports.querySourceReference = 'source_reference';
exports.queryDestinationReference = 'destination_reference';
var queryModificationDate = 'modification_date';
var maxSyncObjects = 1234567890;
/**
 * Note: this list does not contain the additional Node.js storages developped by ClearRoad available [here](https://github.com/clearroad/clearroad-api-storages).
 */
var LocalStorageTypes;
(function (LocalStorageTypes) {
    /**
     * Native Browser IndexedDB storage.
     */
    LocalStorageTypes["indexeddb"] = "indexeddb";
    /**
     * Storage data in a dropbox account. Need `accessToken`.
     */
    LocalStorageTypes["dropbox"] = "dropbox";
    /**
     * Storage data in a google drive account. Need `accessToken`.
     */
    LocalStorageTypes["gdrive"] = "gdrive";
})(LocalStorageTypes = exports.LocalStorageTypes || (exports.LocalStorageTypes = {}));
/* tslint:disable:cyclomatic-complexity */
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
/* tslint:enable:cyclomatic-complexity */
var jsonId = function (value) {
    return jsonIdRec('', '', value);
};
var joinQueries = function (queries, joinType) {
    if (joinType === void 0) { joinType = 'AND'; }
    return queries.filter(function (query) { return !!query; }).join(" " + joinType + " ");
};
var maxLogLevel = 1000;
/**
 * Datetime in the ClearRoad format.
 * @param date Date to format
 */
exports.dateToISO = function (date) { return date.toISOString().split('.')[0] + "Z"; };
var requireOptionsLocalStorage = function (options) {
    if (!options.localStorage || !options.localStorage.type) {
        options.localStorage = {
            type: 'indexeddb'
        };
    }
};
/* tslint:disable:cyclomatic-complexity */
var messageRelativeUrl = function (portalType) {
    switch (portalType) {
        case message_types_1.PortalTypes.BillingPeriodMessage:
            return 'billing_period_message_module';
        case message_types_1.PortalTypes.OdometerReadingMessage:
            return 'odometer_reading_message_module';
        case message_types_1.PortalTypes.RoadAccountMessage:
            return 'road_account_message_module';
        case message_types_1.PortalTypes.RoadEventMessage:
            return 'road_event_message_module';
        case message_types_1.PortalTypes.RoadMessage:
            return 'road_message_module';
        case message_types_1.PortalTypes.RoadReportRequest:
            return 'road_report_request_module';
        case message_types_1.PortalTypes.RoadMileageMessage:
            return 'road_mileage_message_module';
        default:
            throw new Error('Unsupported message type');
    }
};
/* tslint:enable:cyclomatic-complexity */
/**
 * @description
 * The `ClearRoad` class contains a subset of functions from the underlying [jIO.js](https://jio.nexedi.com/) library, which uses [RSVP.js](https://lab.nexedi.com/nexedi/rsvp.js) to chain functions like `Promises`.
 * Please refer to their documentation for more information.
 *
 * @enums
 * LocalStorageTypes
 * PortalTypes
 * ValidationStates
 * GroupingReferences
 *
 * @interfaces
 * IClearRoadOptions
 * IClearRoadOptionsLocalStorage
 * IJioQueryOptions
 * IJioQueryResults
 * IJioQueryResultsData
 * IJioQueryResultRow
 * IQueue
 */
var ClearRoad = /** @class */ (function () {
    /**
     * @description
     * Initialise a new ClearRoad object to interact with the ERP5 storage.
     * @param {string} url ClearRoad API url.
     * @param {string} accessToken Access token to authenticate on the ClearRoad API (if necessary).
     * @param {IClearRoadOptions} options View [IClearRoadOptions](#api-reference-clearroad-interfaces-iclearroadoptions).
     *
     * @usage
     *
     * ```javascript
     * new ClearRoad('apiUrl', 'accessToken');
     * ```
     */
    function ClearRoad(url, accessToken, options) {
        if (options === void 0) { options = {}; }
        this.url = url;
        this.accessToken = accessToken;
        this.options = options;
        this.useLocalStorage = false;
        this.filterPortalTypes = Object.keys(message_types_1.PortalTypes).map(function (k) { return message_types_1.PortalTypes[k]; });
        requireOptionsLocalStorage(options);
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
        if (options.syncPortalTypes) {
            this.filterPortalTypes = options.syncPortalTypes;
        }
        this.initMessagesStorage();
        this.initIngestionReportStorage();
        this.initDirectoryStorage();
        this.initReportStorage();
    }
    /**
     * @internal
     */
    ClearRoad.prototype.queryMinDate = function () {
        // only retrieve the data since xxx
        if (this.options.minDate) {
            var from = new Date(this.options.minDate);
            return queryModificationDate + ": >= \"" + from.toJSON() + "\"";
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
                sub_storage: __assign({}, this.options.localStorage)
            };
        }
        switch (this.localStorageType) {
            case 'dropbox':
            case 'gdrive':
                return {
                    type: 'mapping',
                    sub_storage: {
                        type: 'query',
                        sub_storage: __assign({}, this.options.localStorage)
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
                return __assign({}, this.options.localStorage);
        }
    };
    /**
     * @internal
     */
    ClearRoad.prototype.signatureSubStorage = function (db) {
        if (this.options.useQueryStorage) {
            return {
                type: 'query',
                sub_storage: __assign({}, this.options.localStorage, { database: db })
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
                return __assign({}, this.options.localStorage, { database: db });
        }
    };
    /**
     * @internal
     */
    ClearRoad.prototype.initMessagesStorage = function () {
        var _this = this;
        var refKey = exports.querySourceReference;
        var portalTypes = defaultMessagePortalTypes.filter(function (type) { return _this.filterPortalTypes.indexOf(type) !== -1; });
        // add default one
        portalTypes.push(defaultMessagePortalType);
        var query = joinQueries([
            exports.queryPortalType + ": (" + queryPortalTypes(portalTypes) + ")",
            exports.queryGroupingReference + ": \"" + GroupingReferences.Data + "\"",
            this.queryMinDate()
        ]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-messages-signs");
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
                sort_on: [[queryModificationDate, 'descending']],
                limit: [0, this.options.maxSyncObjects || maxSyncObjects]
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
        var _this = this;
        var refKey = exports.queryDestinationReference;
        var portalTypes = defaultMessagePortalTypes.filter(function (type) { return _this.filterPortalTypes.indexOf(type) !== -1; });
        // add default one
        portalTypes.push(defaultMessagePortalType);
        var query = joinQueries([
            exports.queryPortalType + ": (" + queryPortalTypes(portalTypes) + ")",
            "validation_state: (" + queryValidationStates + ")",
            this.queryMinDate()
        ]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-ingestion-signs");
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
                sort_on: [[queryModificationDate, 'descending']],
                limit: [0, this.options.maxSyncObjects || maxSyncObjects]
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
        var _this = this;
        var refKey = exports.querySourceReference;
        var portalTypes = [
            message_types_1.PortalTypes.RoadEvent,
            message_types_1.PortalTypes.RoadTransaction,
            message_types_1.PortalTypes.OdometerReading
        ].filter(function (type) { return _this.filterPortalTypes.indexOf(type) !== -1; });
        // add default one
        portalTypes.push(defaultDirectoryPortalType);
        var query = joinQueries([
            exports.queryPortalType + ": (" + queryPortalTypes(portalTypes) + ")",
            this.queryMinDate()
        ]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-directory-signs");
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
                sort_on: [[queryModificationDate, 'descending']],
                limit: [0, this.options.maxSyncObjects || maxSyncObjects]
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
            exports.queryPortalType + ": (\"" + message_types_1.PortalTypes.File + "\")",
            this.queryMinDate()
        ]);
        var signatureStorage = this.signatureSubStorage(this.databaseName + "-files-signs");
        var localStorage = this.localSubStorage(refKey);
        var mappingStorageWithEnclosure = __assign({}, localStorage, { attachment_list: [storage_1.defaultAttachmentName], attachment: (_a = {},
                _a[storage_1.defaultAttachmentName] = {
                    get: { uri_template: 'enclosure' },
                    put: { uri_template: 'enclosure' }
                },
                _a) });
        this.reportStorage = jIO.createJIO({
            report_level: maxLogLevel,
            debug: this.options.debug,
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: exports.querySourceReference,
            signature_sub_storage: this.useLocalStorage ? signatureStorage : __assign({}, mappingStorageWithEnclosure, { mapping_dict: (_b = {},
                    _b[exports.queryPortalType] = ['equalSubProperty', exports.querySourceReference],
                    _b) }),
            query: {
                query: query,
                sort_on: [[queryModificationDate, 'descending']],
                limit: [0, this.options.maxSyncObjects || maxSyncObjects]
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
            local_sub_storage: this.useLocalStorage ? localStorage : __assign({}, mappingStorageWithEnclosure, { mapping_dict: (_c = {},
                    _c[exports.queryPortalType] = ['equalSubProperty', refKey],
                    _c) }),
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
     * @description
     * Posts data in your local storage and return the `reference` of the new document.
     * Then use the [sync method](#api-reference-clearroad-sync) to synchronize the data with the ClearRoad API.
     * @param {postData} data The message to post. Each `value` paired with a `key` must be a `string`.
     * @returns {string} The id of the posted message.
     *
     * @usage
     *
     * ```javascript--browser
     * cr.post({
     *   key1: "value",
     *   key2: JSON.stringify({
     *     "subkey": "subvalue"
     *   })
     * }).then(function(id) {
     *   // 'id' is the posted document 'source_reference'
     * })
     * ```
     *
     * ```javascript--browser-es6
     * // 'id' is the posted document 'source_reference'
     * const id = await cr.post({
     *   key1: "value",
     *   key2: JSON.stringify({
     *     "subkey": "subvalue"
     *   })
     * });
     * ```
     *
     * ```javascript--node
     * // 'id' is the posted document 'source_reference'
     * const id = await cr.post({
     *   key1: "value",
     *   key2: JSON.stringify({
     *     "subkey": "subvalue"
     *   })
     * });
     * ```
     */
    ClearRoad.prototype.post = function (data) {
        var _this = this;
        var portalType = data[exports.queryPortalType];
        index_1.validateDefinition(portalType, data);
        var options = __assign({}, data);
        options.parent_relative_url = messageRelativeUrl(portalType);
        // jIO only support string values
        if ('request' in data) {
            options.request = JSON.stringify(data.request);
        }
        options[exports.queryGroupingReference] = GroupingReferences.Data;
        var rusha = new Rusha();
        var reference = rusha.digestFromString(jsonId(options));
        options[exports.querySourceReference] = reference;
        options[exports.queryDestinationReference] = reference;
        return queue_1.getQueue().push(function () {
            return _this.messagesStorage.put(options[exports.querySourceReference], options);
        });
    };
    /**
     * @description
     * Check for the processing state of the message.
     * Allow some time after [synchronizing](#api-reference-clearroad-sync) before checking for the state.
     * @param {string} id The id of the message.
     * @return {ValidationStates} The [state](#api-reference-clearroad-enums-validationstates) of the message.
     *
     * @usage
     *
     * ```javascript--browser
     * cr.post({...})
     *   .then(function(reference) {
     *     // posting a message returns the reference of the message
     *     // use reference to get the state of the message
     *     return cr.state(reference);
     *   })
     *   .then(function(state) {
     *     // state = 'processed'
     *   });
     * ```
     *
     * ```javascript--browser-es6
     * // posting a message returns the reference of the message
     * const reference = await cr.post({
     *   ...
     * });
     * // use reference to get the state of the message
     * const state = await cr.state(reference);
     * // state = 'processed'
     * ```
     *
     * ```javascript--node
     * // posting a message returns the reference of the message
     * const reference = await cr.post({
     *   ...
     * });
     * // use reference to get the state of the message
     * const state = await cr.state(reference);
     * // state = 'processed'
     * ```
     */
    ClearRoad.prototype.state = function (id) {
        return this.allDocs({
            query: exports.querySourceReference + ": \"" + id + "\" AND " + exports.queryGroupingReference + ": \"" + GroupingReferences.Report + "\"",
            select_list: ['state']
        }).push(function (docs) {
            if (docs.data.rows.length) {
                return docs.data.rows[0].value.state;
            }
            return ValidationStates.Unprocessed;
        });
    };
    /**
     * @description
     * Synchronizes the local storage with the ClearRoad Platform (will make sure both storage contain the same data).
     * @param {syncProgressCallback} progress Function to get notified of progress. There are 4 storages to sync.
     * @return {IQueue<void>}
     *
     * @usage
     *
     * ```javascript
     * cr.sync();
     * ```
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
     * @description
     * Retrieve the messages in a certain "processing" state.
     * By default, when a message is not yet synchronized or processed, the state is `not_processed`.
     * @param {ValidationStates} state State of the message.
     * @param {Partial<IJioQueryOptions>} options Set { sort_on, limit } on the results.
     * @return {IQueue<IJioQueryResults>} Search results.
     *
     * @usage
     *
     * ```javascript--browser
     * cr.queryByState('rejected').then(function(results) {
     *   // rejected messages
     * });
     * ```
     *
     * ```javascript--browser-es6
     * const results = await cr.queryByState('rejected');
     * // rejected messages
     * console.log(results);
     * ```
     *
     * ```javascript--node
     * const results = await cr.queryByState('rejected');
     * // rejected messages
     * console.log(results);
     * ```
     */
    ClearRoad.prototype.queryByState = function (state, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var sort_on = options.sort_on, limit = options.limit;
        // query for data message without corresponding report message
        if (state === ValidationStates.Unprocessed) {
            return this.allDocs({
                query: exports.queryGroupingReference + ": \"" + GroupingReferences.Data + "\"",
                select_list: [exports.queryPortalType],
                sort_on: sort_on,
                limit: limit
            })
                .push(function (results) {
                return all(results.data.rows.map(function (result) {
                    return _this.allDocs({
                        query: exports.queryGroupingReference + ": \"" + GroupingReferences.Report + "\" AND " + exports.querySourceReference + ": \"" + result.id + "\""
                    }).push(function (docs) {
                        return docs.data.rows.length === 0 ? result : null;
                    });
                }));
            })
                .push(function (results) {
                var rows = results.filter(function (result) { return result !== null; });
                return {
                    data: {
                        rows: rows,
                        total_rows: rows.length
                    }
                };
            });
        }
        return this.allDocs({
            query: "state: \"" + state + "\" AND " + exports.queryGroupingReference + ": \"" + GroupingReferences.Report + "\"",
            select_list: [exports.queryPortalType, exports.querySourceReference],
            sort_on: sort_on,
            limit: limit
        }).push(function (results) {
            var rows = results.data.rows.map(function (row) {
                var _a;
                return {
                    id: row.value[exports.querySourceReference],
                    value: (_a = {},
                        _a[exports.queryPortalType] = row.value[exports.queryPortalType],
                        _a)
                };
            });
            return {
                data: {
                    rows: rows,
                    total_rows: rows.length
                }
            };
        });
    };
    /**
     * @description
     * Query for documents in the local storage. Make sure `.sync()` is called before.
     * @param {IJioQueryOptions} options Query [options](#api-reference-clearroad-interfaces-ijioqueryoptions). If none set, return all documents.
     * @return {IQueue<IJioQueryResults>} Search results.
     *
     * @usage
     *
     * > Query the documents from ClearRoad Platform:
     *
     * ```javascript--browser
     * cr.allDocs({
     *   query: query_object,
     *   limit: [3, 42],
     *   sort_on: [['key1', 'ascending'], ['key2', 'descending']],
     *   select_list: ['key1', 'key2', 'key3'],
     *   include_docs: false
     * }).then(function(result) {
     *   // read rows in result.rows
     * })
     * ```
     *
     * ```javascript--browser-es6
     * const result = await cr.allDocs({
     *   query: query_object,
     *   limit: [3, 42],
     *   sort_on: [['key1', 'ascending'], ['key2', 'descending']],
     *   select_list: ['key1', 'key2', 'key3'],
     *   include_docs: false
     * });
     * // read rows in result.rows
     * ```
     *
     * ```javascript--node
     * const result = await cr.allDocs({
     *   query: query_object,
     *   limit: [3, 42],
     *   sort_on: [['key1', 'ascending'], ['key2', 'descending']],
     *   select_list: ['key1', 'key2', 'key3'],
     *   include_docs: false
     * });
     * // read rows in result.rows
     * ```
     *
     * > Which returns object in the following format:
     *
     * ```javascript
     * // with select_list: ['select_list_key']
     * {
     *   "total_rows": 39,
     *   "rows": [{
     *     "id": "text_id",
     *     "value": {
     *       "select_list_key": "select_list_value"
     *     }
     *   }, ...]
     * }
     *
     * // with include_docs = true
     * {
     *   "total_rows": 39,
     *   "rows": [{
     *     "id": "text_id",
     *     "doc": {
     *       "key": "value"
     *     }
     *   }, ...]
     * }
     * ```
     *
     */
    ClearRoad.prototype.allDocs = function (options) {
        return this.messagesStorage.allDocs(options);
    };
    /**
     * @description
     * Get a report using the Report Request reference.
     * @param {string} sourceReference The reference of the Report Request.
     * @return {IQueue<any>} The report as JSON.
     *
     * @usage
     *
     * ```javascript--browser
     * cr.getReport('reference').then(function(report) {
     *   // read report
     * })
     * ```
     *
     * ```javascript--browser-es6
     * const report = await cr.getReport('reference');
     * ```
     *
     * ```javascript--node
     * const report = await cr.getReport('reference');
     * ```
     */
    ClearRoad.prototype.getReportFromRequest = function (sourceReference) {
        var _this = this;
        return this.allDocs({
            query: exports.queryPortalType + ": \"" + message_types_1.PortalTypes.File + "\" AND " + exports.querySourceReference + ": \"" + sourceReference + "\"",
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
     * @description
     * Retrieve [the report](https://api.clearroadlab.io/docs/#requesting-a-report) with the given report `reference`.
     * If you only have the `reference` of the report request, please use [getReportFromRequest](#api-reference-clearroad-getreportfromrequest) instead.
     * @param {string} reference The reference of the Report.
     * @return {IQueue<any>} The report as JSON.
     *
     * @usage
     *
     * ```javascript--browser
     * cr.getReportFromRequest('reference').then(function(report) {
     *   // read report
     * })
     * ```
     *
     * ```javascript--browser-es6
     * const report = await cr.getReportFromRequest('reference');
     * ```
     *
     * ```javascript--node
     * const report = await cr.getReportFromRequest('reference');
     * ```
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
    ClearRoad.prototype.isConnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.allDocs({
                            query: '',
                            limit: [0, 1]
                        })];
                    case 1:
                        result = _a.sent();
                        if (result && result.data && result.data.rows && result.data.rows.length > 0) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ClearRoad;
}());
exports.ClearRoad = ClearRoad;

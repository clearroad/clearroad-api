const Rusha = require('rusha');
const jIO = require('jio').jIO;
const { all } = require('rsvp');
import { validateDefinition } from './definitions/index';
import { PortalTypes } from './message-types';
import { getQueue } from './queue';
import { defaultAttachmentName } from './storage';
/**
 * Query key for `PortalTypes`
 */
export const queryPortalType = 'portal_type';
const defaultMessagePortalTypes = [
    PortalTypes.BillingPeriodMessage,
    PortalTypes.RoadEventMessage,
    PortalTypes.RoadMessage,
    PortalTypes.RoadReportRequest
];
const defaultMessagePortalType = PortalTypes.RoadAccountMessage;
const defaultDirectoryPortalType = PortalTypes.RoadAccount;
const queryPortalTypes = (types) => {
    return types.map(type => `"${type}"`).join(' OR ');
};
/**
 * When a message is processed by the ClearRoad platform, it will create a new message with a validation state.
 */
export var ValidationStates;
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
})(ValidationStates || (ValidationStates = {}));
const queryValidationStates = [
    `"${ValidationStates.Processed}"`,
    `"${ValidationStates.Rejected}"`
    // TODO: submitted does not work yet
    // `"${ValidationStates.Submitted}"`
].join(' OR ');
/**
 * Query key for `GroupingReferences`
 */
export const queryGroupingReference = 'grouping_reference';
export var GroupingReferences;
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
})(GroupingReferences || (GroupingReferences = {}));
export const querySourceReference = 'source_reference';
export const queryDestinationReference = 'destination_reference';
const queryModificationDate = 'modification_date';
const maxSyncObjects = 1234567890;
/**
 * Note: this list does not contain the additional Node.js storages developped by ClearRoad available [here](https://github.com/clearroad/clearroad-api-storages).
 */
export var LocalStorageTypes;
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
})(LocalStorageTypes || (LocalStorageTypes = {}));
/* tslint:disable:cyclomatic-complexity */
const jsonIdRec = (keyValueSpace, key, value, deep = 0) => {
    let res;
    if (value && typeof value.toJSON === 'function') {
        value = value.toJSON();
    }
    if (Array.isArray(value)) {
        res = [];
        for (let i = 0; i < value.length; i += 1) {
            res[res.length] = jsonIdRec(keyValueSpace, i, value[i], deep + 1);
            if (res[res.length - 1] === undefined) {
                res[res.length - 1] = 'null';
            }
        }
        if (res.length === 0) {
            return '[]';
        }
        return `[${res.join(', ')}]`;
    }
    if (typeof value === 'object' && value !== null) {
        res = Object.keys(value);
        res.sort();
        for (let i = 0, l = res.length; i < l; i += 1) {
            key = res[i];
            res[i] = jsonIdRec(keyValueSpace, key, value[key], deep + 1);
            if (res[i] !== undefined) {
                res[i] = `${JSON.stringify(key)}: ${keyValueSpace}${res[i]}`;
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
        return `{${res.join(', ')}`;
    }
    return JSON.stringify(value);
};
/* tslint:enable:cyclomatic-complexity */
const jsonId = (value) => {
    return jsonIdRec('', '', value);
};
const joinQueries = (queries, joinType = 'AND') => queries.filter(query => !!query).join(` ${joinType} `);
const maxLogLevel = 1000;
/**
 * Datetime in the ClearRoad format.
 * @param date Date to format
 */
export const dateToISO = (date) => `${date.toISOString().split('.')[0]}Z`;
const requireOptionsLocalStorage = (options) => {
    if (!options.localStorage || !options.localStorage.type) {
        options.localStorage = {
            type: 'indexeddb'
        };
    }
};
/* tslint:disable:cyclomatic-complexity */
const messageRelativeUrl = (portalType) => {
    switch (portalType) {
        case PortalTypes.RoadAccountMessage:
            return 'road_account_message_module';
        case PortalTypes.RoadEventMessage:
            return 'road_event_message_module';
        case PortalTypes.RoadMessage:
            return 'road_message_module';
        case PortalTypes.BillingPeriodMessage:
            return 'billing_period_message_module';
        case PortalTypes.RoadReportRequest:
            return 'road_report_request_module';
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
export class ClearRoad {
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
    constructor(url, accessToken, options = {}) {
        this.url = url;
        this.accessToken = accessToken;
        this.options = options;
        this.useLocalStorage = false;
        this.filterPortalTypes = Object.keys(PortalTypes).map(k => PortalTypes[k]);
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
    queryMinDate() {
        // only retrieve the data since xxx
        if (this.options.minDate) {
            const from = new Date(this.options.minDate);
            return `${queryModificationDate}: >= "${from.toJSON()}"`;
        }
        return '';
    }
    /**
     * @internal
     */
    localSubStorage(key) {
        if (this.options.useQueryStorage) {
            return {
                type: 'query',
                sub_storage: Object.assign({}, this.options.localStorage)
            };
        }
        switch (this.localStorageType) {
            case 'dropbox':
            case 'gdrive':
                return {
                    type: 'mapping',
                    sub_storage: {
                        type: 'query',
                        sub_storage: Object.assign({}, this.options.localStorage)
                    },
                    mapping_dict: {
                        [queryPortalType]: ['equalSubProperty', key]
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
                        database: this.databaseName
                    }
                };
            default:
                return Object.assign({}, this.options.localStorage);
        }
    }
    /**
     * @internal
     */
    signatureSubStorage(db) {
        if (this.options.useQueryStorage) {
            return {
                type: 'query',
                sub_storage: Object.assign({}, this.options.localStorage, { database: db })
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
                return Object.assign({}, this.options.localStorage, { database: db });
        }
    }
    /**
     * @internal
     */
    initMessagesStorage() {
        const refKey = querySourceReference;
        const portalTypes = defaultMessagePortalTypes.filter(type => this.filterPortalTypes.indexOf(type) !== -1);
        // add default one
        portalTypes.push(defaultMessagePortalType);
        const query = joinQueries([
            `${queryPortalType}: (${queryPortalTypes(portalTypes)})`,
            `${queryGroupingReference}: "${GroupingReferences.Data}"`,
            this.queryMinDate()
        ]);
        const signatureStorage = this.signatureSubStorage(`${this.databaseName}-messages-signatures`);
        const localStorage = this.localSubStorage(refKey);
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
                query,
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
    }
    /**
     * @internal
     */
    initIngestionReportStorage() {
        const refKey = queryDestinationReference;
        const portalTypes = defaultMessagePortalTypes.filter(type => this.filterPortalTypes.indexOf(type) !== -1);
        // add default one
        portalTypes.push(defaultMessagePortalType);
        const query = joinQueries([
            `${queryPortalType}: (${queryPortalTypes(portalTypes)})`,
            `validation_state: (${queryValidationStates})`,
            this.queryMinDate()
        ]);
        const signatureStorage = this.signatureSubStorage(`${this.databaseName}-ingestion-signatures`);
        const localStorage = this.localSubStorage(refKey);
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
                query,
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
    }
    /**
     * @internal
     */
    initDirectoryStorage() {
        const refKey = querySourceReference;
        const portalTypes = [
            PortalTypes.RoadEvent,
            PortalTypes.RoadTransaction
        ].filter(type => this.filterPortalTypes.indexOf(type) !== -1);
        // add default one
        portalTypes.push(defaultDirectoryPortalType);
        const query = joinQueries([
            `${queryPortalType}: (${queryPortalTypes(portalTypes)})`,
            this.queryMinDate()
        ]);
        const signatureStorage = this.signatureSubStorage(`${this.databaseName}-directory-signatures`);
        const localStorage = this.localSubStorage(refKey);
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
                query,
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
    }
    /**
     * @internal
     */
    initReportStorage() {
        const refKey = 'reference';
        const query = joinQueries([
            `${queryPortalType}: ("${PortalTypes.File}")`,
            this.queryMinDate()
        ]);
        const signatureStorage = this.signatureSubStorage(`${this.databaseName}-files-signatures`);
        const localStorage = this.localSubStorage(refKey);
        const mappingStorageWithEnclosure = Object.assign({}, localStorage, {
            attachment_list: [defaultAttachmentName],
            attachment: {
                [defaultAttachmentName]: {
                    get: { uri_template: 'enclosure' },
                    put: { uri_template: 'enclosure' }
                }
            }
        });
        this.reportStorage = jIO.createJIO({
            report_level: maxLogLevel,
            debug: this.options.debug,
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: querySourceReference,
            signature_sub_storage: this.useLocalStorage ? signatureStorage : Object.assign({}, mappingStorageWithEnclosure, {
                mapping_dict: {
                    [queryPortalType]: ['equalSubProperty', querySourceReference]
                }
            }),
            query: {
                query,
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
            local_sub_storage: this.useLocalStorage ? localStorage : Object.assign({}, mappingStorageWithEnclosure, {
                mapping_dict: {
                    [queryPortalType]: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                attachment_list: [defaultAttachmentName],
                attachment: {
                    [defaultAttachmentName]: {
                        get: {
                            uri_template: `${this.url}/{+id}/Base_downloadWithCors`
                        },
                        put: {
                            erp5_put_template: `${this.url}/{+id}/Base_edit`
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
    }
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
    post(data) {
        const portalType = data[queryPortalType];
        validateDefinition(portalType, data);
        const options = Object.assign({}, data);
        options.parent_relative_url = messageRelativeUrl(portalType);
        // jIO only support string values
        if ('request' in data) {
            options.request = JSON.stringify(data.request);
        }
        options[queryGroupingReference] = GroupingReferences.Data;
        const rusha = new Rusha();
        const reference = rusha.digestFromString(jsonId(options));
        options[querySourceReference] = reference;
        options[queryDestinationReference] = reference;
        return getQueue().push(() => {
            return this.messagesStorage.put(options[querySourceReference], options);
        });
    }
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
    state(id) {
        return this.allDocs({
            query: `${querySourceReference}: "${id}" AND ${queryGroupingReference}: "${GroupingReferences.Report}"`,
            select_list: ['state']
        }).push(docs => {
            if (docs.data.rows.length) {
                return docs.data.rows[0].value.state;
            }
            return ValidationStates.Unprocessed;
        });
    }
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
    sync(progress = () => { }) {
        return getQueue()
            .push(() => {
            return this.messagesStorage.repair().push(() => progress('messages'));
        })
            .push(() => {
            return this.ingestionReportStorage.repair().push(() => progress('ingestion-reports'));
        })
            .push(() => {
            return this.directoryStorage.repair().push(() => progress('directories'));
        })
            .push(() => {
            return this.reportStorage.repair().push(() => progress('reports'));
        });
    }
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
    queryByState(state, options = {}) {
        const { sort_on, limit } = options;
        // query for data message without corresponding report message
        if (state === ValidationStates.Unprocessed) {
            return this.allDocs({
                query: `${queryGroupingReference}: "${GroupingReferences.Data}"`,
                select_list: [queryPortalType],
                sort_on,
                limit
            })
                .push(results => {
                return all(results.data.rows.map(result => {
                    return this.allDocs({
                        query: `${queryGroupingReference}: "${GroupingReferences.Report}" AND ${querySourceReference}: "${result.id}"`
                    }).push(docs => {
                        return docs.data.rows.length === 0 ? result : null;
                    });
                }));
            })
                .push(results => {
                const rows = results.filter(result => result !== null);
                return {
                    data: {
                        rows,
                        total_rows: rows.length
                    }
                };
            });
        }
        return this.allDocs({
            query: `state: "${state}" AND ${queryGroupingReference}: "${GroupingReferences.Report}"`,
            select_list: [queryPortalType, querySourceReference],
            sort_on,
            limit
        }).push(results => {
            const rows = results.data.rows.map(row => {
                return {
                    id: row.value[querySourceReference],
                    value: {
                        [queryPortalType]: row.value[queryPortalType]
                    }
                };
            });
            return {
                data: {
                    rows,
                    total_rows: rows.length
                }
            };
        });
    }
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
    allDocs(options) {
        return this.messagesStorage.allDocs(options);
    }
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
    getReportFromRequest(sourceReference) {
        return this.allDocs({
            query: `${queryPortalType}: "${PortalTypes.File}" AND ${querySourceReference}: "${sourceReference}"`,
            select_list: ['reference']
        }).push(result => {
            const report = result.data.rows[0];
            if (report) {
                return this.getReport(report.value.reference);
            }
            return null;
        });
    }
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
    getReport(reference) {
        return getQueue()
            .push(() => {
            return this.reportStorage.getAttachment(reference, defaultAttachmentName);
        })
            .push(report => {
            return {
                [defaultAttachmentName]: report
            };
        }, () => {
            return this.reportStorage.allAttachments(reference);
        })
            .push(attachment => jIO.util.readBlobAsText(attachment[defaultAttachmentName]))
            .push(report => report.target.result ? JSON.parse(report.target.result) : {});
    }
}
//# sourceMappingURL=clearroad.js.map
import { postData } from './definitions/interfaces';
import { PortalTypes } from './message-types';
import { IQueue } from './queue';
import { IJioQueryOptions, IJioQueryResults } from './storage';
/**
 * Query key for `PortalTypes`
 */
export declare const queryPortalType = "portal_type";
/**
 * When a message is processed by the ClearRoad platform, it will create a new message with a validation state.
 */
export declare enum ValidationStates {
    /**
     * Message has been processed by the ClearRoad platform.
     */
    Processed = "processed",
    /**
     * Message has been rejected by the ClearRoad platform. A `comment` will be added explaining the reason.
     */
    Rejected = "rejected",
    /**
     * Message has been submitted to the ClearRoad platform but still processing.
     */
    Submitted = "submitted",
    /**
     * When the message has not been sent to the ClearRoad platform yet, the state is "not_processed".
     */
    Unprocessed = "not_processed"
}
/**
 * Query key for `GroupingReferences`
 */
export declare const queryGroupingReference = "grouping_reference";
export declare enum GroupingReferences {
    /**
     * Message created on the ClearRoad platform.
     */
    Report = "report"
}
export declare const querySourceReference = "source_reference";
export declare const queryDestinationReference = "destination_reference";
/**
 * ClearRoad will create 4 storages during synchronization, reprensented each by a name.
 */
export declare type storageName = 'messages' | 'ingestion-reports' | 'directories' | 'reports';
export declare type syncProgressCallback = (type: storageName) => void;
/**
 * Note: this list does not contain the additional Node.js storages developped by ClearRoad available [here](https://github.com/clearroad/clearroad-api-storages).
 */
export declare enum LocalStorageTypes {
    /**
     * Native Browser IndexedDB storage.
     */
    indexeddb = "indexeddb",
    /**
     * Storage data in a dropbox account. Need `accessToken`.
     */
    dropbox = "dropbox",
    /**
     * Storage data in a google drive account. Need `accessToken`.
     */
    gdrive = "gdrive"
}
export interface IClearRoadOptionsLocalStorage {
    /**
     * Type of the storage. View [LocalStorageTypes](#api-reference-clearroad-enums-localstoragetypes).
     */
    type: LocalStorageTypes | string;
    /**
     * Access token to authenticate on the ClearRoad API (if necessary).
     */
    accessToken?: string;
    /**
     * Name of the database when the objects will be stored.
     */
    database?: string;
}
export interface IClearRoadOptions {
    /**
     * Options for the local storage. View [IClearRoadOptionsLocalStorage](#api-reference-clearroad-interfaces-iclearroadoptionslocalstorage).
     */
    localStorage?: IClearRoadOptionsLocalStorage;
    /**
     * Messages updated before this date will not be synchronized. If not set, all messages will be synchronized. Improves speed of synchronisation for big sets.
     * @example
     * ```
     * const today = new Date();
     * const from = today.setMonth(today.getMonth() - 1); // one month synchronization only
     * new ClearRoad(url, token, {minDate: from})
     * ```
     */
    minDate?: Date | number | string;
    /**
     * View [PortalTypes](#api-reference-clearroad-enums-portaltypes). Defines which types of messages to synchronize. If not set, all messages will be synchronized. Improves speed of synchronisation for big sets.
     */
    syncPortalTypes?: PortalTypes[];
    /**
     * Maximum number of objects that will be sycnrhonized from the ClearRoad platform to the local storage. Default is `1234567890`.
     */
    maxSyncObjects?: number;
    /**
     * Force using a query storage around the localStorage. Needed if the storage can not query data directly. See information on the storage.
     */
    useQueryStorage?: boolean;
    /**
     * Log to console replication steps between local and remote storage.
     */
    debug?: boolean;
}
export interface IAttachmentOptions {
    format: 'text' | 'json' | 'blob' | 'data_url' | 'array_buffer';
}
/**
 * Datetime in the ClearRoad format.
 * @param date Date to format
 */
export declare const dateToISO: (date: Date) => string;
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
export declare class ClearRoad {
    private url;
    private accessToken?;
    private options;
    private databaseName;
    private localStorageType;
    private messagesStorage;
    private ingestionReportStorage;
    private directoryStorage;
    private reportStorage;
    private useLocalStorage;
    private filterPortalTypes;
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
    constructor(url: string, accessToken?: string | undefined, options?: IClearRoadOptions);
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
    post(data: postData): IQueue<string>;
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
    state(id: string): IQueue<ValidationStates>;
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
    sync(progress?: syncProgressCallback): IQueue<void>;
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
    queryByState(state: ValidationStates, options?: Partial<IJioQueryOptions>): IQueue<IJioQueryResults>;
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
    allDocs(options?: IJioQueryOptions): IQueue<IJioQueryResults>;
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
    getReportFromRequest(sourceReference: string): IQueue<any>;
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
    getReport(reference: string): IQueue<any>;
    isConnected(): Promise<boolean>;
}

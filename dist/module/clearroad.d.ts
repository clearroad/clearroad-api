import { portalType } from './message-types';
import { IQueue } from './queue';
import { IJioQueryOptions, IJioQueryResults } from './storage';
/**
 * Query key for `PortalTypes`
 */
export declare const queryPortalType = "portal_type";
/**
 * Each message is represented by a "portal_type" (or message category)
 */
export declare enum PortalTypes {
    BillingPeriodMessage = "Billing Period Message",
    File = "File",
    RoadAccount = "Road Account",
    RoadAccountMessage = "Road Account Message",
    RoadEvent = "Road Event",
    RoadEventMessage = "Road Event Message",
    RoadMessage = "Road Message",
    RoadReportRequest = "Road Report Request",
    RoadTransaction = "Road Transaction"
}
/**
 * When a message is processed by the ClearRoad platform, it will create a new message with a validation state.
 * When the message has not been sent to the platform yet, the state is "not_processed".
 */
export declare enum ValidationStates {
    Processed = "processed",
    Rejected = "rejected",
    Submitted = "submitted",
    Unprocessed = "not_processed"
}
/**
 * Query key for `GroupingReferences`
 */
export declare const queryGroupingReference = "grouping_reference";
export declare enum GroupingReferences {
    /**
     * Message created on the ClearRoad Platform
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
export declare type localStorageType = 'indexeddb' | 'dropbox' | 'gdrive';
export interface IClearRoadOptions {
    localStorage?: {
        type: localStorageType | string;
        accessToken?: string;
        /**
         * Primary database name. Default to 'clearroad'
         */
        database?: string;
    };
    maxDate?: Date | number | string;
    /**
     * Force using a query storage around the localStorage.
     * Needed if the storage can not query data directly. See information on the storage
     */
    useQueryStorage?: boolean;
    /**
     * Turn on debugging mode to console
     */
    debug?: boolean;
}
export interface IAttachmentOptions {
    format: 'text' | 'json' | 'blob' | 'data_url' | 'array_buffer';
}
export interface IPostData {
    [queryPortalType]: portalType;
}
export interface IPostRoadAccountMessage extends IPostData {
    [queryPortalType]: PortalTypes.RoadAccountMessage;
    account_manager: string;
    data_collector: string;
    condition: string;
    cert_id: string;
    account_reference: string;
    effective_date: string;
    expiration_date?: string;
    fuel_consumption: string;
    fuel_taxable: string;
    obu_reference?: string;
    vehicle_reference: string;
    product_line: string;
}
export interface IPostBillingPeriodMessage extends IPostData {
    [queryPortalType]: PortalTypes.BillingPeriodMessage;
    reference: string;
    start_date: string;
    stop_date: string;
}
export interface IPostRoadReportRequest extends IPostData {
    [queryPortalType]: PortalTypes.RoadReportRequest;
    report_type: string;
    billing_period_reference: string;
    request_date: string;
    request?: string;
}
export interface IPostRoadEventMessage extends IPostData {
    [queryPortalType]: PortalTypes.RoadEventMessage;
    request: {
        vehicle_reference: string;
        obu_reference: string;
        event_details: Array<{
            type: number;
            date: string;
        }>;
    };
}
export interface IPostRoadMessage extends IPostData {
    [queryPortalType]: PortalTypes.RoadMessage;
    request: {
        description: string;
        vehicle_reference: string;
        obu_reference: string;
        type: string;
        transaction_date: string;
        mileage_details: Array<{
            fuel_price?: number;
            fuel_quantity: number;
            miles_price?: number;
            miles_quantity: number;
            rule_id: number;
            sub_rule_id: number;
        }>;
    };
}
export declare type postData = IPostRoadAccountMessage | IPostBillingPeriodMessage | IPostRoadReportRequest | IPostRoadEventMessage | IPostRoadMessage;
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
    /**
     * Instantiate a ClearRoad api instance.
     * @param url ClearRoad API url
     * @param accessToken ClearRoad API access token (required when using Node)
     * @param options Override default options
     */
    constructor(url: string, accessToken?: string | undefined, options?: IClearRoadOptions);
    /**
     * Post a message to the ClearRoad API.
     * If not currently connected, messages will be put in the local storage and sent later when using `.sync()`
     * @param data The message
     */
    post(data: postData): IQueue<string>;
    /**
     * Get the state of a message.
     * @param id The id of the message
     */
    state(id: string): IQueue<ValidationStates>;
    /**
     * Synchronize local data and API data:
     *  - send local data to API if not present yet
     *  - retrieve API data in your local storage
     * @param progress Function to get notified of progress. There are 4 storages to sync.
     */
    sync(progress?: syncProgressCallback): IQueue<void>;
    /**
     * Query the messages with a specific state.
     * @param state The state to query for
     * @param options Set { sort_on, limit } on the results
     */
    queryByState(state: ValidationStates, options?: Partial<IJioQueryOptions>): IQueue<IJioQueryResults>;
    /**
     * Query for documents in the local storage. Make sure `.sync()` is called before.
     * @param options Query options. If none set, return all documents.
     * @return Search results
     */
    allDocs(options?: IJioQueryOptions): IQueue<IJioQueryResults>;
    /**
     * Get a report using the Report Request reference
     * @param sourceReference The reference of the Report Request
     * @return The report as JSON
     */
    getReportFromRequest(sourceReference: string): IQueue<any>;
    /**
     * Get a report using the reference.
     * If you do not have the Report reference, use `getReportFromRequest` with the Report Request reference instead.
     * @param reference The reference of the Report
     * @return The report as JSON
     */
    getReport(reference: string): IQueue<any>;
}

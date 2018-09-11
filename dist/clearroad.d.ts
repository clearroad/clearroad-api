export interface IQueue {
    push: (onFullfilled?: Function, onRejected?: Function) => IQueue;
}
export declare type Queue = () => IQueue;
export declare type storageName = 'messages' | 'ingestion-reports' | 'directories' | 'reports';
export declare type localStorageType = 'indexeddb' | 'dropbox' | 'gdrive';
export interface IOptions {
    localStorage?: {
        type: localStorageType;
        accessToken?: string;
    };
    maxDate?: Date | number | string;
}
export interface IAttachmentOptions {
    format: 'text' | 'json' | 'blob' | 'data_url' | 'array_buffer';
}
export interface IQueryOptions {
    query: string;
    limit?: [number, number];
    sort_on?: Array<[string, 'ascending' | 'descending']>;
    select_list?: string[];
    include_docs?: boolean;
}
export declare type syncProgressCallback = (type: storageName) => void;
export declare type portalType = 'Road Account Message' | 'Billing Period Message' | 'Road Message' | 'Road Report Request' | 'Road Event Message';
export interface IPostData {
    portal_type: portalType;
}
export interface IPostRoadAccountMessage extends IPostData {
    portal_type: 'Road Account Message';
    account_manager: string;
    data_collector: string;
    condition: string;
    cert_id: string;
    account_reference: string;
    effective_date: string;
    expiration_date: string;
    fuel_consumption: string;
    fuel_taxable: string;
    obu_reference: string;
    vehicle_reference: string;
    product_line: string;
}
export interface IPostBillingPeriodMessage extends IPostData {
    portal_type: 'Billing Period Message';
    reference: string;
    start_date: string;
    stop_date: string;
}
export interface IPostRoadReportRequest extends IPostData {
    portal_type: 'Road Report Request';
    report_type: string;
    billing_period_reference: string;
    request_date: string;
    request: string;
}
export interface IPostRoadEventMessage extends IPostData {
    portal_type: 'Road Event Message';
    request: string;
}
export interface IPostRoadMessage extends IPostData {
    portal_type: 'Road Message';
    request: string;
}
export declare type postData = IPostRoadAccountMessage | IPostBillingPeriodMessage | IPostRoadReportRequest | IPostRoadEventMessage | IPostRoadMessage;
export declare class ClearRoad {
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
    constructor(url: string, accessToken?: string, options?: IOptions);
    /**
     * Post a message to the ClearRoad API.
     * If not currently connected, messages will be put in the local storage and sent later when using `.sync()`
     * @param data The message
     */
    post(data: postData): IQueue;
    /**
     * Synchronize local data and API data:
     *  - send local data to API if not present yet
     *  - retrieve API data in your local storage
     * @param progress Function to get notified of progress. There are 4 storages to sync.
     */
    sync(progress?: syncProgressCallback): IQueue;
    /**
     * Query for documents in the local storage. Make sure `.sync()` is called before.
     * @param options Query options. If none set, return all documents.
     */
    allDocs(options?: IQueryOptions): IQueue;
    /**
     * Get a report from the API.
     * @param id The id of the report
     */
    getReport(id: string): IQueue;
}

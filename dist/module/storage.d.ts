import { IQueue } from './queue';
/**
 * If the storage only support one attachment type, use this one.
 */
export declare const defaultAttachmentName = "data";
export declare type JioQuerySortProperty = [string, 'ascending' | 'descending'];
export interface IJioQueryOptions {
    /**
     * Search with a query. Refer to the jIO documentation in the jIO Query Engine section for details.
     * @see https://jio.nexedi.com/
     */
    query: string;
    /**
     * Limit the results. Leave empty for no limit.
     * @example [10, 20]
     */
    limit?: [number, number];
    /**
     * List of fields to sort on, each specifying the order with ascending/descending. Example: `[['date', 'ascending'], ['id', 'descending]]`
     */
    sort_on?: JioQuerySortProperty[];
    /**
     * When provided, the response has a `value` containing the values of these keys for each document.
     * @example ['id', 'date']
     */
    select_list?: string[];
    /**
     * When `true`, the response has a `doc` containing the full metadata for each document.
     */
    include_docs?: boolean;
}
export interface IJioQueryResultRow {
    /**
     * Document id
     */
    id: string;
    /**
     * Original document value.
     */
    doc?: any;
    /**
     * Filtered properties of the document.
     */
    value?: any;
}
export interface IJioQueryResultsData {
    /**
     * List of [result row](#api-reference-clearroad-interfaces-ijioqueryresultrow).
     */
    rows: IJioQueryResultRow[];
    /**
     * The total number of results.
     */
    total_rows: number;
}
export interface IJioQueryResults {
    /**
     * The result [data](#api-reference-clearroad-interfaces-ijioqueryresultsdata).
     */
    data: IJioQueryResultsData;
}
export interface IJioStorage {
    get: (id: string) => IQueue<any>;
    put: (id: string, data: any) => IQueue<string>;
    remove: (id: string) => IQueue<string>;
    post?: (data: any) => IQueue<string>;
    getAttachment: (id: string, name: string, options?: any) => IQueue<any>;
    putAttachment: (id: string, name: string, blob: Blob) => IQueue<any>;
    removeAttachment: (id: string, name: string) => IQueue<string>;
    allAttachments: (id: string) => IQueue<any>;
    hasCapacity: (name: string) => boolean;
    buildQuery: (options?: IJioQueryOptions) => IQueue<IJioQueryResultRow[]>;
}
export interface IJioProxyStorage extends IJioStorage {
    allDocs: (options?: IJioQueryOptions) => IQueue<IJioQueryResults>;
    repair: () => IQueue<void>;
}
declare type operator = 'AND' | 'OR' | 'NOT';
declare type comparison = '!=' | '<' | '<=' | '>' | '>=';
/**
 * Output of `jIO.QueryFactory.create(query)`
 */
export interface IJioSimpleQuery {
    type: 'simple';
    operator?: comparison;
    key: string;
    value: string;
}
/**
 * Output of `jIO.QueryFactory.create(query)`
 */
export interface IJioComplexQuery {
    type: 'complex';
    operator: operator;
    query_list: Array<IJioSimpleQuery | IJioComplexQuery>;
    key?: string;
}
export {};

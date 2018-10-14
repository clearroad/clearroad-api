import { IQueue } from './queue';
export interface IJioQueryOptions {
    query: string;
    limit?: [number, number];
    sort_on?: Array<[string, 'ascending' | 'descending']>;
    select_list?: string[];
    include_docs?: boolean;
}
export interface IJioStorage {
    get: (id: string) => IQueue;
    post: (data: any) => IQueue;
    put: (id: string, data: any) => IQueue;
    remove: (id: string) => IQueue;
    getAttachment: (id: string, action: string, options?: any) => IQueue;
    putAttachment: (id: string, name: string, blob: Blob) => IQueue;
    removeAttachment: (id: string) => IQueue;
    allAttachments: (id: string) => IQueue;
    hasCapacity: (name: string) => boolean;
    buildQuery: (options: any) => IQueue;
}
export interface IJioProxyStorage extends IJioStorage {
    allDocs: (options?: IJioQueryOptions) => IQueue;
    repair: () => IQueue;
}

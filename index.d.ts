declare namespace rsvp {
  interface IQueue {
    push: (onFullfilled?: Function, onRejected?: Function) => IQueue;
  }
}

type storageName = 'messages'|'ingestion-reports'|'directories'|'reports';
type localStorageType = 'indexeddb'|'dropbox'|'gdrive';
interface ILocalStorageOptions {
  type: clearroad.localStorageType;
  accessToken?: string;
}
interface IAttachmentOptions {
  format: 'text' | 'json' | 'blob' | 'data_url' | 'array_buffer';
}
interface IQueryOptions {
  query: string;
  limit?: [number, number];
  sort_on?: Array<[string, 'ascending' | 'descending']>;
  select_list?: string[];
  include_docs?: boolean;
}
type syncProgressCallback = (type: clearroad.storageName) => void;
type portalType = 'Road Account Message' | 'Billing Period Message' |
  'Road Message' | 'Road Report Request' | 'Road Event Message';
interface IPostData {
  portal_type: clearroad.portalType;
}
interface IPostRoadAccountMessage extends IPostData {
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
interface IPostBillingPeriodMessage extends IPostData {
  portal_type: 'Billing Period Message';
  reference: string;
  start_date: string;
  stop_date: string;
}
interface IPostRoadReportRequest extends IPostData {
  portal_type: 'Road Report Request';
  report_type: string;
  billing_period_reference: string;
  request_date: string;
  request: string;
}
interface IPostRoadEventMessage extends IPostData {
  portal_type: 'Road Event Message';
  request: string;
}
interface IPostRoadMessage extends IPostData {
  portal_type: 'Road Message';
  request: string;
}
type postData = IPostRoadAccountMessage | IPostBillingPeriodMessage | IPostRoadReportRequest |
  IPostRoadEventMessage | IPostRoadMessage;

declare class ClearRoad {
  /**
   * Instantiate a ClearRoad api instance.
   * @param url ClearRoad API url
   * @param login ClearRoad API login (required when using Node)
   * @param password ClearRoad API password (required when using Node)
   * @param localStorageOptions Override default options
   */
  constructor(url: string, login?: string, password?: string, localStorageOptions?: ILocalStorageOptions);

  /**
   * Post a message to the ClearRoad API.
   * If not currently connected, messages will be put in the local storage and sent later when using `.sync()`
   * @param data The message
   */
  post(data: postData): rsvp.IQueue;

  /**
   * Synchronize local data and API data:
   *  - send local data to API if not present yet
   *  - retrieve API data in your local storage
   * @param progress Function to get notified of progress. There are 4 storages to sync.
   */
  sync(progress: syncProgressCallback): rsvp.IQueue;

  /**
   * Query for documents in the local storage. Make sure `.sync()` is called before.
   * @param options Query options. If none set, return all documents.
   */
  allDocs(options?: IQueryOptions): rsvp.IQueue;

  /**
   * Get an attachment from the API.
   * @param id The id of the attachment
   * @param name The name of the attachment
   * @param options Attachment options.
   */
  getAttachment(id: string, name: string, options?: IAttachmentOptions): rsvp.IQueue;
}

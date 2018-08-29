declare namespace rsvp {
  interface IQueue {
    push: (onFullfilled?: Function, onRejected?: Function) => IQueue;
  }
}

declare namespace clearroad {
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
  type portalType = 'Road Account Message' | 'Billing Period Message' | 'Road Message' | 'Road Report Request' | 'Road Event Message';
  interface IPostData {
    portal_type: portalType;
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
  type storageType = 'indexeddb'|'dropbox'|'gdrive';
  interface IStorageOptions {
    type: storageType;
    accessToken?: string;
  }
  type postData = IPostRoadAccountMessage | IPostBillingPeriodMessage | IPostRoadReportRequest | IPostRoadEventMessage | IPostRoadMessage;
}

declare class ClearRoad {
  private mainStorage;
  private ingestionReportStorage;
  private directoryStorage;
  private reportStorage;
  constructor(url: string, login?: string, password?: string, localStorageOptions?: clearroad.IStorageOptions);
  post(data: clearroad.postData): rsvp.IQueue;
  sync(): rsvp.IQueue;
  allDocs(options: clearroad.IQueryOptions): rsvp.IQueue;
  getAttachment(id: string, name: string, options?: clearroad.IAttachmentOptions): rsvp.IQueue;
}

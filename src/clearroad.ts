import RSVP from 'rsvp';
import Rusha from 'rusha';
require('../lib/jio.js');

declare var jIO;

export interface IQueue {
  push: (onFullfilled?: Function, onRejected?: Function) => IQueue;
}

export type Queue = () => IQueue;

export type storageName = 'messages'|'ingestion-reports'|'directories'|'reports';

export type localStorageType = 'indexeddb'|'dropbox'|'gdrive';
export interface ILocalStorageOptions {
  type: localStorageType;
  accessToken?: string;
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

export type syncProgressCallback = (type: storageName) => void;

export type portalType = 'Road Account Message' | 'Billing Period Message' |
  'Road Message' | 'Road Report Request' | 'Road Event Message';

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
export type postData = IPostRoadAccountMessage | IPostBillingPeriodMessage | IPostRoadReportRequest |
  IPostRoadEventMessage | IPostRoadMessage;

const database = 'clearroad';

const jsonIdRec = (keyValueSpace: string, key: string|number, value: any, deep = 0) => {
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

const jsonId = (value: any) => {
  return jsonIdRec('', '', value);
};

const merge = (obj1, obj2) => {
  const obj3 = {};
  for (const attrname in obj1) {
    if (obj1.hasOwnProperty(attrname)) {
      obj3[attrname] = obj1[attrname];
    }
  }
  for (const attrname in obj2) {
    if (obj2.hasOwnProperty(attrname)) {
      obj3[attrname] = obj2[attrname];
    }
  }
  return obj3;
};

export class ClearRoad {
  private messagesStorage: any;
  private ingestionReportStorage: any;
  private directoryStorage: any;
  private reportStorage: any;

  /**
   * Instantiate a ClearRoad api instance.
   * @param url ClearRoad API url
   * @param accessToken ClearRoad API access token (required when using Node)
   * @param localStorageOptions Override default options
   */
  constructor(
    url: string, accessToken?: string,
    localStorageOptions: ILocalStorageOptions = {
      type: 'indexeddb'
    }
  ) {
    if (localStorageOptions.type === 'dropbox' || localStorageOptions.type === 'gdrive') {
      localStorageOptions = {
        type: 'drivetojiomapping',
        sub_storage: {
          type: localStorageOptions.type,
          access_token: localStorageOptions.accessToken
        } as ILocalStorageOptions
      } as any;
    }
    else if (!localStorageOptions.type) {
      localStorageOptions.type = 'indexeddb';
    }

    let query = 'portal_type:(' +
      '"Road Account Message" OR "Road Event Message" OR "Road Message"' +
      ' OR "Billing Period Message" OR "Road Report Request")' +
      ' AND grouping_reference:"data"';

    this.messagesStorage = jIO.createJIO({
      type: 'replicate',
      parallel_operation_amount: 1,
      use_remote_post: false,
      conflict_handling: 1,
      signature_hash_key: 'source_reference',
      signature_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database: `${database}-messages-signatures`
        }, localStorageOptions)
      },
      query: {
        query,
        sort_on: [['modification_date', 'descending']],
        limit: [0, 1234567890]
      },
      check_local_modification: false, // we only create new message
      check_local_creation: true,
      check_local_deletion: false, // once created, message are not deleted
      check_remote_modification: false, // ERP5 does not modify the message
      check_remote_creation: true, // we want message back in case we delete our local db
      check_remote_deletion: false, // ERP5 does not delete message
      local_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database
        }, localStorageOptions)
      },
      remote_sub_storage: {
        type: 'mapping',
        id: ['equalSubProperty', 'source_reference'],
        sub_storage: {
          type: 'erp5',
          url,
          default_view_reference: 'jio_view',
          access_token: accessToken
        }
      }
    });

    query = 'portal_type:(' +
      '"Road Account Message" OR "Road Event Message" OR "Road Message" ' +
      'OR "Billing Period Message" OR "Road Report Request")' +
      ' AND validation_state:("processed" OR "rejected")';

    this.ingestionReportStorage = jIO.createJIO({
      type: 'replicate',
      parallel_operation_amount: 1,
      use_remote_post: false,
      conflict_handling: 1,
      signature_hash_key: 'destination_reference',
      signature_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database: `${database}-ingestion-signatures`
        }, localStorageOptions)
      },
      query: {
        query,
        sort_on: [['modification_date', 'descending']],
        limit: [0, 1234567890]
      },
      check_local_modification: false, // local modification will always be erased
      check_local_creation: false,
      check_local_deletion: false,
      check_remote_modification: false, // there is no modification, only creation of report
      check_remote_creation: true,
      check_remote_deletion: true,
      local_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database
        }, localStorageOptions)
      },
      remote_sub_storage: {
        type: 'mapping',
        id: ['equalSubProperty', 'destination_reference'],
        sub_storage: {
          type: 'erp5',
          url,
          default_view_reference: 'jio_ingestion_report_view',
          access_token: accessToken
        }
      }
    });

    query = 'portal_type:("Road Account" OR "Road Event" OR "Road Transaction")';

    this.directoryStorage = jIO.createJIO({
      type: 'replicate',
      parallel_operation_amount: 1,
      use_remote_post: false,
      conflict_handling: 1,
      signature_hash_key: 'source_reference',
      signature_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database: `${database}-directory-signatures`
        }, localStorageOptions)
      },
      query: {
        query,
        sort_on: [['modification_date', 'descending']],
        limit: [0, 200]
      },
      check_local_modification: false, // local modification will always be erased
      check_local_creation: false,
      check_local_deletion: false,
      check_remote_modification: false,
      check_remote_creation: true,
      check_remote_deletion: true,
      local_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database
        }, localStorageOptions)
      },
      remote_sub_storage: {
        type: 'mapping',
        id: ['equalSubProperty', 'source_reference'],
        sub_storage: {
          type: 'erp5',
          url,
          default_view_reference: 'jio_directory_view',
          access_token: accessToken
        }
      }
    });

    query = 'portal_type:("File")';

    this.reportStorage = jIO.createJIO({
      type: 'replicate',
      parallel_operation_amount: 1,
      use_remote_post: false,
      conflict_handling: 1,
      signature_hash_key: 'reference',
      signature_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database: `${database}-files-signatures`
        }, localStorageOptions)
      },
      query: {
        query,
        sort_on: [['modification_date', 'descending']],
        limit: [0, 1234567890]
      },
      check_local_modification: false, // local modification will always be erased
      check_local_creation: false,
      check_local_deletion: false,
      check_remote_modification: false,
      check_remote_creation: true,
      check_remote_deletion: true,
      check_remote_attachment_creation: true,
      check_remote_attachment_modification: false,
      check_remote_attachment_deletion: true,
      check_local_attachment_creation: false,
      check_local_attachment_modification: false,
      check_local_attachment_deletion: false,
      local_sub_storage: {
        type: 'query',
        sub_storage: merge({
          database
        }, localStorageOptions)
      },
      remote_sub_storage: {
        type: 'mapping',
        id: ['equalSubProperty', 'reference'],
        attachment_list: ['data'],
        attachment: {
          data: {
            get: {
              uri_template: `${url}/{id}/Base_downloadWithCors`
            },
            put: {
              erp5_put_template: `${url}/{+id}/Base_edit`
            }
          }
        },
        sub_storage: {
          type: 'erp5',
          url,
          default_view_reference: 'jio_report_view',
          access_token: accessToken
        }
      }
    });
  }

  /**
   * Post a message to the ClearRoad API.
   * If not currently connected, messages will be put in the local storage and sent later when using `.sync()`
   * @param data The message
   */
  post(data: postData): IQueue {
    const options: any = merge({}, data);

    switch (data.portal_type) {
      case 'Road Account Message':
        options.parent_relative_url = 'road_account_message_module';
        break;
      case 'Road Event Message':
        options.parent_relative_url = 'road_event_message_module';
        break;
      case 'Road Message':
        options.parent_relative_url = 'road_message_module';
        break;
      case 'Billing Period Message':
        options.parent_relative_url = 'billing_period_message_module';
        break;
      case 'Road Report Request':
        options.parent_relative_url = 'road_report_request_module';
        break;
    }

    options.grouping_reference = 'data';
    const dataAsString = jsonId(options);
    const rusha = new Rusha();
    const reference = rusha.digestFromString(dataAsString);
    options.source_reference = reference;
    options.destination_reference = reference;

    const queue = new (RSVP as any).Queue() as IQueue;
    return queue.push(() => {
      return this.messagesStorage.put(options.source_reference, options);
    });
  }

  /**
   * Synchronize local data and API data:
   *  - send local data to API if not present yet
   *  - retrieve API data in your local storage
   * @param progress Function to get notified of progress. There are 4 storages to sync.
   */
  sync(progress: syncProgressCallback = () => {}): IQueue {
    const queue = new (RSVP as any).Queue() as IQueue;
    return queue
      .push(() => {
        return this.messagesStorage.repair();
      })
      .push(() => {
        progress('messages');
        return this.ingestionReportStorage.repair();
      })
      .push(() => {
        progress('ingestion-reports');
        return this.directoryStorage.repair();
      })
      .push(() => {
        progress('directories');
        return this.reportStorage.repair();
      })
      .push(() => {
        progress('reports');
      });
  }

  /**
   * Query for documents in the local storage. Make sure `.sync()` is called before.
   * @param options Query options. If none set, return all documents.
   */
  allDocs(options?: IQueryOptions): IQueue {
    return this.messagesStorage.allDocs(options);
  }

  /**
   * Get an attachment from the API.
   * @param id The id of the attachment
   * @param name The name of the attachment
   * @param options Attachment options.
   */
  getAttachment(id: string, name: string, options?: IAttachmentOptions): IQueue {
    return this.reportStorage.getAttachment(id, name, options);
  }
}

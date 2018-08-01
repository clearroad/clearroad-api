declare var jIO: any;
declare var RSVP: any;
declare var Rusha: any;

namespace rsvp {
  export interface IQueue {
    push: (onFullfilled?: Function, onRejected?: Function) => IQueue;
  }
}

namespace clearroad {
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

  type portalType = 'Road Account Message' |
    'Billing Period Message' |
    'Road Message' |
    'Road Report Request' |
    'Road Event Message';

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

  export type postData = IPostRoadAccountMessage |
    IPostBillingPeriodMessage |
    IPostRoadReportRequest |
    IPostRoadEventMessage |
    IPostRoadMessage;
}

const database = 'clearroad';

const concatStringNTimes = (val: string, iteration: number) => {
  let res = '';
  while (--iteration >= 0) {
    res += val;
  }
  return res;
};

const jsonIdRec = (
  indent: string, replacer: string|string[]|Function, keyValueSpace: string,
  key: string|number, value: any, deep = 0
) => {
  let res;
  let mySpace;
  if (value && typeof value.toJSON === 'function') {
    value = value.toJSON();
  }
  if (typeof replacer === 'function') {
    value = replacer(key, value);
  }

  if (indent) {
    mySpace = concatStringNTimes(indent, deep);
  }
  if (Array.isArray(value)) {
    res = [];
    for (let i = 0; i < value.length; i += 1) {
      res[res.length] = jsonIdRec(indent, replacer, keyValueSpace, i, value[i], deep + 1);
      if (res[res.length - 1] === undefined) {
        res[res.length - 1] = 'null';
      }
    }
    if (res.length === 0) { return '[]'; }
    if (indent) {
      return '[\n' + mySpace + indent +
        res.join(',\n' + mySpace + indent) +
        '\n' + mySpace + ']';
    }
    return `[${res.join(', ')}]`;
  }
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(replacer)) {
      res = replacer.reduce((p: string[], c: string) => {
        p.push(c);
        return p;
      }, []);
    }
    else {
      res = Object.keys(value);
    }
    res.sort();
    for (let i = 0, l = res.length; i < l; i += 1) {
      key = res[i];
      res[i] = jsonIdRec(indent, replacer, keyValueSpace, key, value[key], deep + 1);
      if (res[i] !== undefined) {
        res[i] = `${JSON.stringify(key)}: ${keyValueSpace}${res[i]}`;
      } else {
        res.splice(i, 1);
        l -= 1;
        i -= 1;
      }
    }
    if (res.length === 0) {
      return '{}';
    }
    if (indent) {
      return '{\n' + mySpace + indent +
        res.join(',\n' + mySpace + indent) +
        '\n' + mySpace + '}';
    }
    return `{${res.join(', ')}`;
  }
  return JSON.stringify(value);
};

const jsonId = (value: any, replacer: string|string[]|Function, space: string|number) => {
  let indent;
  let keyValueSpace = '';
  if (typeof space === 'string') {
    if (space !== '') {
      indent = space;
      keyValueSpace = ' ';
    }
  }
  else if (typeof space === 'number') {
    if (isFinite(space) && space > 0) {
      indent = concatStringNTimes(' ', space);
      keyValueSpace = ' ';
    }
  }
  return jsonIdRec(indent, replacer, keyValueSpace, '', value);
};

class ClearRoad {
  private mainStorage: any;
  private ingestionReportStorage: any;
  private directoryStorage: any;
  private reportStorage: any;

  constructor(url: string, login?: string, password?: string) {
    let query = 'portal_type:(' +
      '"Road Account Message" OR "Road Event Message" OR "Road Message"' +
      ' OR "Billing Period Message" OR "Road Report Request")' +
      ' AND grouping_reference:"data"';

    this.mainStorage = jIO.createJIO({
      type: 'replicate',
      parallel_operation_amount: 1,
      use_remote_post: false,
      conflict_handling: 1,
      signature_hash_key: 'source_reference',
      signature_sub_storage: {
        type: 'query',
        sub_storage: {
          type: 'indexeddb',
          database: `${database}-messages-signatures`
        }
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
        sub_storage: {
          type: 'indexeddb',
          database
        }
      },
      remote_sub_storage: {
        type: 'mapping',
        id: ['equalSubProperty', 'source_reference'],
        sub_storage: {
          type: 'erp5',
          url,
          default_view_reference: 'jio_view',
          login,
          password
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
        sub_storage: {
          type: 'indexeddb',
          database: `${database}-ingestion-signatures`
        }
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
        sub_storage: {
          type: 'indexeddb',
          database
        }
      },
      remote_sub_storage: {
        type: 'mapping',
        id: ['equalSubProperty', 'destination_reference'],
        sub_storage: {
          type: 'erp5',
          url,
          default_view_reference: 'jio_ingestion_report_view',
          login,
          password
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
        sub_storage: {
          type: 'indexeddb',
          database: `${database}-directory-signatures`
        }
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
        sub_storage: {
          type: 'indexeddb',
          database
        }
      },
      remote_sub_storage: {
        type: 'mapping',
        id: ['equalSubProperty', 'source_reference'],
        sub_storage: {
          type: 'erp5',
          url,
          default_view_reference: 'jio_directory_view',
          login,
          password
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
        sub_storage: {
          type: 'indexeddb',
          database: `${database}-files-signatures`
        }
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
        sub_storage: {
          type: 'indexeddb',
          database
        }
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
          login,
          password
        }
      }
    });
  }

  post(data: clearroad.postData): rsvp.IQueue {
    const options: any = data;

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
    const dataAsString = jsonId(options, '', ''); // jio.util.stringify
    const rusha = new Rusha();
    const reference = rusha.digestFromString(dataAsString);
    options.source_reference = reference;
    options.destination_reference = reference;

    const queue: rsvp.IQueue = new RSVP.Queue();
    return queue.push(() => {
      return this.mainStorage.put(options.source_reference, options);
    });
  }

  sync(): rsvp.IQueue {
    const queue: rsvp.IQueue = new RSVP.Queue();
    return queue
      .push(() => {
        return this.mainStorage.repair();
      })
      .push(() => {
        return this.ingestionReportStorage.repair();
      })
      .push(() => {
        return this.directoryStorage.repair();
      })
      .push(() => {
        return this.reportStorage.repair();
      });
  }

  allDocs(options: clearroad.IQueryOptions): rsvp.IQueue {
    return this.mainStorage.allDocs(options);
  }

  getAttachment(id: string, name: string, options?: clearroad.IAttachmentOptions): rsvp.IQueue {
    return this.reportStorage.getAttachment(id, name, options);
  }
}

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var RSVP = _interopDefault(require('rsvp'));
var jio_js = require('./lib/jio.js');

const database = 'clearroad';

const concatStringNTimes = (val, iteration) => {
  let res = '';
  while (--iteration >= 0) {
    res += val;
  }
  return res;
};

const jsonIdRec = (
  indent, replacer, keyValueSpace,
  key, value, deep = 0
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
      res = replacer.reduce((p, c) => {
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

const jsonId = (value, replacer, space) => {
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

const merge = (obj1, obj2) => {
  var obj3 = {};
  for (var attrname in obj1) {
    obj3[attrname] = obj1[attrname];
  }
  for (var attrname in obj2) {
    obj3[attrname] = obj2[attrname];
  }
  return obj3;
};

class ClearRoad {
  constructor(url, login, password, localStorageOptions = {}) {
    let query = 'portal_type:(' +
      '"Road Account Message" OR "Road Event Message" OR "Road Message"' +
      ' OR "Billing Period Message" OR "Road Report Request")' +
      ' AND grouping_reference:"data"';

    if (localStorageOptions.type === 'dropbox' || localStorageOptions.type === 'gdrive') {
      localStorageOptions = {
        type: 'drivetojiomapping',
        sub_storage: {
          type: localStorageOptions.type,
          access_token: localStorageOptions.accessToken
        }
      };
    }
    else if (!localStorageOptions.type) {
      localStorageOptions.type = 'indexeddb';
    }

    this.mainStorage = jio_js.jIO.createJIO({
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
          login,
          password
        }
      }
    });

    query = 'portal_type:(' +
      '"Road Account Message" OR "Road Event Message" OR "Road Message" ' +
      'OR "Billing Period Message" OR "Road Report Request")' +
      ' AND validation_state:("processed" OR "rejected")';

    this.ingestionReportStorage = jio_js.jIO.createJIO({
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
          login,
          password
        }
      }
    });

    query = 'portal_type:("Road Account" OR "Road Event" OR "Road Transaction")';

    this.directoryStorage = jio_js.jIO.createJIO({
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
          login,
          password
        }
      }
    });

    query = 'portal_type:("File")';

    this.reportStorage = jio_js.jIO.createJIO({
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
          login,
          password
        }
      }
    });
  }

  post(data) {
    const options = data;

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

    const queue = new RSVP.Queue();
    return queue.push(() => {
      return this.mainStorage.put(options.source_reference, options);
    });
  }

  sync() {
    const queue = new RSVP.Queue();
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

  allDocs(options) {
    return this.mainStorage.allDocs(options);
  }

  getAttachment(id, name, options) {
    return this.reportStorage.getAttachment(id, name, options);
  }
}

exports.ClearRoad = ClearRoad;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var RSVP = _interopDefault(require('rsvp'));
var Rusha = _interopDefault(require('rusha'));

var jIO = require('../../lib/jio.js').jIO;
var database = 'clearroad';
var jsonIdRec = function (keyValueSpace, key, value, deep) {
    if (deep === void 0) { deep = 0; }
    var res;
    if (value && typeof value.toJSON === 'function') {
        value = value.toJSON();
    }
    if (Array.isArray(value)) {
        res = [];
        for (var i = 0; i < value.length; i += 1) {
            res[res.length] = jsonIdRec(keyValueSpace, i, value[i], deep + 1);
            if (res[res.length - 1] === undefined) {
                res[res.length - 1] = 'null';
            }
        }
        if (res.length === 0) {
            return '[]';
        }
        return "[" + res.join(', ') + "]";
    }
    if (typeof value === 'object' && value !== null) {
        res = Object.keys(value);
        res.sort();
        for (var i = 0, l = res.length; i < l; i += 1) {
            key = res[i];
            res[i] = jsonIdRec(keyValueSpace, key, value[key], deep + 1);
            if (res[i] !== undefined) {
                res[i] = JSON.stringify(key) + ": " + keyValueSpace + res[i];
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
        return "{" + res.join(', ');
    }
    return JSON.stringify(value);
};
var jsonId = function (value) {
    return jsonIdRec('', '', value);
};
var merge = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        if (obj1.hasOwnProperty(attrname)) {
            obj3[attrname] = obj1[attrname];
        }
    }
    for (var attrname in obj2) {
        if (obj2.hasOwnProperty(attrname)) {
            obj3[attrname] = obj2[attrname];
        }
    }
    return obj3;
};
var ClearRoad = /** @class */ (function () {
    /**
     * Instantiate a ClearRoad api instance.
     * @param url ClearRoad API url
     * @param login ClearRoad API login (required when using Node)
     * @param password ClearRoad API password (required when using Node)
     * @param localStorageOptions Override default options
     */
    function ClearRoad(url, login, password, localStorageOptions) {
        if (localStorageOptions === void 0) { localStorageOptions = {
            type: 'indexeddb'
        }; }
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
        var query = 'portal_type:(' +
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
                    database: database + "-messages-signatures"
                }, localStorageOptions)
            },
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: true,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            local_sub_storage: {
                type: 'query',
                sub_storage: merge({
                    database: database
                }, localStorageOptions)
            },
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', 'source_reference'],
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_view',
                    login: login,
                    password: password
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
                    database: database + "-ingestion-signatures"
                }, localStorageOptions)
            },
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: true,
            local_sub_storage: {
                type: 'query',
                sub_storage: merge({
                    database: database
                }, localStorageOptions)
            },
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', 'destination_reference'],
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_ingestion_report_view',
                    login: login,
                    password: password
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
                    database: database + "-directory-signatures"
                }, localStorageOptions)
            },
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 200]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: true,
            local_sub_storage: {
                type: 'query',
                sub_storage: merge({
                    database: database
                }, localStorageOptions)
            },
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', 'source_reference'],
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_directory_view',
                    login: login,
                    password: password
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
                    database: database + "-files-signatures"
                }, localStorageOptions)
            },
            query: {
                query: query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
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
                    database: database
                }, localStorageOptions)
            },
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', 'reference'],
                attachment_list: ['data'],
                attachment: {
                    data: {
                        get: {
                            uri_template: url + "/{id}/Base_downloadWithCors"
                        },
                        put: {
                            erp5_put_template: url + "/{+id}/Base_edit"
                        }
                    }
                },
                sub_storage: {
                    type: 'erp5',
                    url: url,
                    default_view_reference: 'jio_report_view',
                    login: login,
                    password: password
                }
            }
        });
    }
    /**
     * Post a message to the ClearRoad API.
     * If not currently connected, messages will be put in the local storage and sent later when using `.sync()`
     * @param data The message
     */
    ClearRoad.prototype.post = function (data) {
        var _this = this;
        var options = merge({}, data);
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
        var dataAsString = jsonId(options);
        var rusha = new Rusha();
        var reference = rusha.digestFromString(dataAsString);
        options.source_reference = reference;
        options.destination_reference = reference;
        var queue = new RSVP.Queue();
        return queue.push(function () {
            return _this.messagesStorage.put(options.source_reference, options);
        });
    };
    /**
     * Synchronize local data and API data:
     *  - send local data to API if not present yet
     *  - retrieve API data in your local storage
     * @param progress Function to get notified of progress. There are 4 storages to sync.
     */
    ClearRoad.prototype.sync = function (progress) {
        var _this = this;
        if (progress === void 0) { progress = function () { }; }
        var queue = new RSVP.Queue();
        return queue
            .push(function () {
            return _this.messagesStorage.repair();
        })
            .push(function () {
            progress('messages');
            return _this.ingestionReportStorage.repair();
        })
            .push(function () {
            progress('ingestion-reports');
            return _this.directoryStorage.repair();
        })
            .push(function () {
            progress('directories');
            return _this.reportStorage.repair();
        })
            .push(function () {
            progress('reports');
        });
    };
    /**
     * Query for documents in the local storage. Make sure `.sync()` is called before.
     * @param options Query options. If none set, return all documents.
     */
    ClearRoad.prototype.allDocs = function (options) {
        return this.messagesStorage.allDocs(options);
    };
    /**
     * Get an attachment from the API.
     * @param id The id of the attachment
     * @param name The name of the attachment
     * @param options Attachment options.
     */
    ClearRoad.prototype.getAttachment = function (id, name, options) {
        return this.reportStorage.getAttachment(id, name, options);
    };
    return ClearRoad;
}());

exports.ClearRoad = ClearRoad;

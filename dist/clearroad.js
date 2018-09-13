import RSVP from 'rsvp';
import Rusha from 'rusha';
require('../lib/jio.js');
const database = 'clearroad';
const jsonIdRec = (keyValueSpace, key, value, deep = 0) => {
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
const jsonId = (value) => {
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
    /**
     * Instantiate a ClearRoad api instance.
     * @param url ClearRoad API url
     * @param accessToken ClearRoad API access token (required when using Node)
     * @param options Override default options
     */
    constructor(url, accessToken, options = {}) {
        this.useLocalStorage = false;
        if (!options.localStorage || !options.localStorage.type) {
            options.localStorage = {
                type: 'indexeddb'
            };
        }
        let localStorageOptions = options.localStorage;
        if (localStorageOptions.type === 'dropbox' || localStorageOptions.type === 'gdrive') {
            localStorageOptions = {
                type: 'drivetojiomapping',
                sub_storage: {
                    type: localStorageOptions.type,
                    access_token: localStorageOptions.accessToken
                }
            };
        }
        this.useLocalStorage = localStorageOptions.type === 'indexeddb';
        // only retrieve the data since xxx
        let queryMaxDate = '';
        if (options.maxDate) {
            const from = new Date(options.maxDate);
            queryMaxDate = ` AND modification_date: >= "${from.toJSON()}"`;
        }
        let query = 'portal_type:(' +
            '"Road Account Message" OR "Road Event Message" OR "Road Message"' +
            ' OR "Billing Period Message" OR "Road Report Request")' +
            ' AND grouping_reference:"data"' + queryMaxDate;
        const localSubStorage = {
            type: 'query',
            sub_storage: {
                type: 'indexeddb',
                database
            }
        };
        const mappingSubStorage = {
            type: 'mapping',
            sub_storage: {
                type: 'query',
                sub_storage: localStorageOptions
            }
        };
        const signatureSubStorage = {
            type: this.useLocalStorage ? 'indexeddb' : 'memory'
        };
        let refKey = 'source_reference';
        this.messagesStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: `${database}-messages-signatures`
                })
            },
            query: {
                query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: true,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingSubStorage, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url,
                    default_view_reference: 'jio_view',
                    access_token: accessToken
                }
            }
        });
        refKey = 'destination_reference';
        query = 'portal_type:(' +
            '"Road Account Message" OR "Road Event Message" OR "Road Message" ' +
            'OR "Billing Period Message" OR "Road Report Request")' +
            ' AND validation_state:("processed" OR "rejected")' + queryMaxDate;
        this.ingestionReportStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: `${database}-ingestion-signatures`
                })
            },
            query: {
                query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingSubStorage, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url,
                    default_view_reference: 'jio_ingestion_report_view',
                    access_token: accessToken
                }
            }
        });
        refKey = 'source_reference';
        query = 'portal_type:("Road Account" OR "Road Event" OR "Road Transaction")' + queryMaxDate;
        this.directoryStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: refKey,
            signature_sub_storage: {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: `${database}-directory-signatures`
                })
            },
            query: {
                query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 200]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingSubStorage, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                sub_storage: {
                    type: 'erp5',
                    url,
                    default_view_reference: 'jio_directory_view',
                    access_token: accessToken
                }
            }
        });
        refKey = 'reference';
        query = 'portal_type:("File")' + queryMaxDate;
        const mappingStorageWithEnclosure = merge(mappingSubStorage, {
            attachment_list: ['data'],
            attachment: {
                data: {
                    get: { uri_template: 'enclosure' },
                    put: { uri_template: 'enclosure' }
                }
            }
        });
        this.reportStorage = jIO.createJIO({
            type: 'replicate',
            parallel_operation_amount: 1,
            use_remote_post: false,
            conflict_handling: 1,
            signature_hash_key: 'source_reference',
            signature_sub_storage: this.useLocalStorage ? {
                type: 'query',
                sub_storage: merge(signatureSubStorage, {
                    database: `${database}-files-signatures`
                })
            } : merge(mappingStorageWithEnclosure, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', 'source_reference']
                }
            }),
            query: {
                query,
                sort_on: [['modification_date', 'descending']],
                limit: [0, 1234567890]
            },
            check_local_modification: false,
            check_local_creation: false,
            check_local_deletion: false,
            check_remote_modification: false,
            check_remote_creation: true,
            check_remote_deletion: false,
            check_remote_attachment_creation: true,
            check_remote_attachment_modification: false,
            check_remote_attachment_deletion: true,
            check_local_attachment_creation: false,
            check_local_attachment_modification: false,
            check_local_attachment_deletion: false,
            local_sub_storage: this.useLocalStorage ? localSubStorage : merge(mappingStorageWithEnclosure, {
                mapping_dict: {
                    portal_type: ['equalSubProperty', refKey]
                }
            }),
            remote_sub_storage: {
                type: 'mapping',
                id: ['equalSubProperty', refKey],
                attachment_list: ['data'],
                attachment: {
                    data: {
                        get: {
                            uri_template: `${url}/{+id}/Base_downloadWithCors`
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
    post(data) {
        const options = merge({}, data);
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
        const queue = new RSVP.Queue();
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
    sync(progress = () => { }) {
        const queue = new RSVP.Queue();
        return queue
            .push(() => {
            return this.messagesStorage.repair().push(() => progress('messages'));
        })
            .push(() => {
            return this.ingestionReportStorage.repair().push(() => progress('ingestion-reports'));
        })
            .push(() => {
            return this.directoryStorage.repair().push(() => progress('directories'));
        })
            .push(() => {
            return this.reportStorage.repair().push(() => progress('reports'));
        });
    }
    /**
     * Query for documents in the local storage. Make sure `.sync()` is called before.
     * @param options Query options. If none set, return all documents.
     */
    allDocs(options) {
        return this.messagesStorage.allDocs(options);
    }
    /**
     * Get a report using the Report Request reference
     * @param sourceReference The reference of the Report Request
     */
    getReportFromRequest(sourceReference) {
        return this.allDocs({
            query: 'portal_type:"File"',
            select_list: ['source_reference', 'reference']
        }).push(result => {
            const report = result.data.rows.find(row => row.value.source_reference === sourceReference);
            if (report) {
                return this.getReport(report.value.reference);
            }
            return {};
        });
    }
    /**
     * Get a report using the reference.
     * If you do not have the Report reference, use `getReportFromRequest` with the Report Request reference instead.
     * @param reference The reference of the Report
     */
    getReport(reference) {
        if (this.useLocalStorage) {
            return this.reportStorage.getAttachment(reference, 'data');
        }
        return this.reportStorage.allAttachments(reference);
    }
}
//# sourceMappingURL=clearroad.js.map
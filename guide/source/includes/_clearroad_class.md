# API reference

The `ClearRoad` class contains a subset of functions from the underlying [jIO.js](https://jio.nexedi.com/) library, which uses [RSVP.js](https://lab.nexedi.com/nexedi/rsvp.js) to chain functions like `Promises`. Please refer to their documentation for more information.

## constructor

```javascript
new ClearRoad('apiUrl', 'accessToken');
```

`new ClearRoad(url, accessToken, options)`

Initialise a new ClearRoad object to interact with the ERP5 storage.

Property | Type | Description | Required
--------- | ----------- | ----------- | -----------
url | `string` | Url of the storage
accessToken | `string` | Access token to authenticate on the ClearRoad API (if necessary) | No
options.localStorage.type | `string` | View [types](#api-reference-local-storage-types) | Yes
options.localStorage.accessToken | `string` | Access token of the storage (if required) | No
options.database | `string` | Name of the database when the objects will be stored | No
options.useQueryStorage | `boolean` | Use if the localStorage does not support query | No
options.syncPortalTypes | `PortalTypes[]` | View [PortalTypes](#api-reference-portaltypes). Defines which types of messages to synchronize. If not set, all messages will be synchronized. Improves speed of synchronisation for big sets | No
options.minDate | <code>string&#124;number&#124;Date</code> | Messages updated before this date will not be synchronized. If not set, all messages will be synchronized. Improves speed of synchronisation for big sets | No
options.maxSyncObjects | `number` | Maximum number of objects that will be sycnrhonized from the ClearRoad platform to the local storage. Default is `1234567890` | No
options.debug | `boolean` | Log to console replication steps between local and remote storage | No

### Local Storage Types

Note: this list does not contain the additional Node.js storages developped by ClearRoad available [here](https://github.com/clearroad/clearroad-api-storages)

Value | Description | Options | Support | Need access token
--------- | --------- | ----------- | ----------- | -----------
indexeddb | Native Browser IndexedDB storage | `{type: 'indexeddb'}` | Browser only | No
dropbox | Storage data in a dropbox account | `{type: 'dropbox', accessToken: string}` | Browser and Node | Yes
gdrive | Storage data in a google drive account | `{type: 'gdrive', accessToken: string}` | Browser and Node | Yes

## post

```javascript--browser
cr.post({
  key1: "value",
  key2: JSON.stringify({
    "subkey": "subvalue"
  })
}).then(function(id) {
  // 'id' is the posted document 'source_reference'
})
```

```javascript--browser-es6
// 'id' is the posted document 'source_reference'
const id = await cr.post({
  key1: "value",
  key2: JSON.stringify({
    "subkey": "subvalue"
  })
});
```

```javascript--node
// 'id' is the posted document 'source_reference'
const id = await cr.post({
  key1: "value",
  key2: JSON.stringify({
    "subkey": "subvalue"
  })
});
```

`post(data): Promise<string>`

Posts data in your local storage and return the `reference` of the new document. Then use the [sync method](#api-reference-sync) to synchronize the data with the ClearRoad API.

Property | Type | Description
--------- | ----------- | -----------
data | `Object` | Data to post. Each `value` paired with a `key` must be a `string`.

## sync

```javascript
cr.sync();
```

`sync(): Promise<void>`

Synchronizes the local storage with the ClearRoad Platform (will make sure both storage contain the same data).

## allDocs

> Query the documents from ClearRoad Platform:

```javascript--browser
cr.allDocs({
  query: query_object,
  limit: [3, 42],
  sort_on: [['key1', 'ascending'], ['key2', 'descending']],
  select_list: ['key1', 'key2', 'key3'],
  include_docs: false
}).then(function(result) {
  // read rows in result.rows
})
```

```javascript--browser-es6
const result = await cr.allDocs({
  query: query_object,
  limit: [3, 42],
  sort_on: [['key1', 'ascending'], ['key2', 'descending']],
  select_list: ['key1', 'key2', 'key3'],
  include_docs: false
});
// read rows in result.rows
```

```javascript--node
const result = await cr.allDocs({
  query: query_object,
  limit: [3, 42],
  sort_on: [['key1', 'ascending'], ['key2', 'descending']],
  select_list: ['key1', 'key2', 'key3'],
  include_docs: false
});
// read rows in result.rows
```

> Which returns object in the following format:

```javascript
// with select_list: ['select_list_key']
{
  "total_rows": 39,
  "rows": [{
    "id": "text_id",
    "value": {
      "select_list_key": "select_list_value"
    }
  }, ...]
}

// with include_docs = true
{
  "total_rows": 39,
  "rows": [{
    "id": "text_id",
    "doc": {
      "key": "value"
    }
  }, ...]
}
```

`allDocs({query, limit, sort_on, select_list, include_docs}): Promise<IJioQueryResults>`

Retrieve a list of documents.

Property | Type | Description
--------- | ----------- | -----------
query | `string` | Refer to the [jIO documentation](https://jio.nexedi.com/) in the **jIO Query Engine** section for details
limit (optional) | `[number, number]` | Limit the results. Leave empty for no limit, or `[min, max]` for paging
sort_on (optional) | <code>[[string, 'ascending'&#124;'descending']]</code> | List of fields to sort on, each specifying the order with `ascending`/`descending`
select_list | `string[]` | When provided, the response has a `value` containing the values of these keys for each document
include_docs | `boolean` | When `true`, the response has a `doc` containing the full metadata for each document

## queryByState

```javascript--browser
cr.queryByState('rejected').then(function(results) {
  // rejected messages
});
```

```javascript--browser-es6
const results = await cr.queryByState('rejected');
// rejected messages
console.log(results);
```

```javascript--node
const results = await cr.queryByState('rejected');
// rejected messages
console.log(results);
```

`queryByState(state): Promise<IJioQueryResults>`

Retrieve the messages in a certain "processing" state. By default, when a message is not yet synchronized or processed, the state is `not_processed`.

Property | Type | Description
--------- | ----------- | -----------
state | [ValidationStates](#api-reference-validationstates) | State of the message

## state

```javascript--browser
cr.post({...})
  .then(function(reference) {
    // posting a message returns the reference of the message
    // use reference to get the state of the message
    return cr.state(reference);
  })
  .then(function(state) {
    // state = 'processed'
  });
```

```javascript--browser-es6
// posting a message returns the reference of the message
const reference = await cr.post({
  ...
});
// use reference to get the state of the message
const state = await cr.state(reference);
// state = 'processed'
```

```javascript--node
// posting a message returns the reference of the message
const reference = await cr.post({
  ...
});
// use reference to get the state of the message
const state = await cr.state(reference);
// state = 'processed'
```

`state(reference): Promise<ValidationStates>`

Check for the processing state of the message.
Allow some time after [synchronizing](#api-reference-sync) before checking for the state.

Property | Type | Description
--------- | ----------- | -----------
reference | `string` | Reference of the message

## getReport

```javascript--browser
cr.getReport('reference').then(function(report) {
  // read report
})
```

```javascript--browser-es6
const report = await cr.getReport('reference');
```

```javascript--node
const report = await cr.getReport('reference');
```

`getReport(reference): Promise<Object>`

Retrieve [the report](https://api.clearroadlab.io/docs/#requesting-a-report) with the given report `reference`. If you only have the `reference` of the report request, please use [getReportFromRequest](#api-reference-getreportfromrequest) instead.

Property | Type | Description
--------- | ----------- | -----------
reference | `string` | Reference of the report

## getReportFromRequest

```javascript--browser
cr.getReportFromRequest('reference').then(function(report) {
  // read report
})
```

```javascript--browser-es6
const report = await cr.getReportFromRequest('reference');
```

```javascript--node
const report = await cr.getReportFromRequest('reference');
```

`getReportFromRequest(reference): Promise<Object>`

Property | Type | Description
--------- | ----------- | -----------
reference | `string` | Reference of the report request

## PortalTypes

Key | Value
--------- | -----------
BillingPeriodMessage | `Billing Period Message`
File | `File`
RoadAccount | `Road Account`
RoadAccountMessage | `Road Account Message`
RoadEvent | `Road Event`
RoadEventMessage | `Road Event Message`
RoadMessage | `Road Message`
RoadReportRequest | `Road Report Request`
RoadTransaction | `Road Transaction`

## ValidationStates

Key | Value
--------- | -----------
Processed | `processed`
Rejected | `rejected`
Submitted | `submitted`
Unprocessed | `not_processed`
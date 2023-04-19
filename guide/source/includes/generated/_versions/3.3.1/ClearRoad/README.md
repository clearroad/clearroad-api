







## ClearRoad



<aside class="notice">
  This documentation has been generated for the version <code>3.3.1</code>
</aside>


The `ClearRoad` class contains a subset of functions from the underlying [jIO.js](https://jio.nexedi.com/) library, which uses [RSVP.js](https://lab.nexedi.com/nexedi/rsvp.js) to chain functions like `Promises`.
Please refer to their documentation for more information.


<!-- @usage tag -->


<!-- @property tags -->

### constructor


```javascript
new ClearRoad('apiUrl', 'accessToken');
```


<code>constructor(url,&nbsp;accessToken,&nbsp;options)</code>
  




Initialise a new ClearRoad object to interact with the ERP5 storage.

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
url | <code>string</code> | ClearRoad API url.| Yes
accessToken | <code>string</code> | Access token to authenticate on the ClearRoad API (if necessary).| No
options | <code>IClearRoadOptions</code> | View [IClearRoadOptions](#api-reference-clearroad-interfaces-iclearroadoptions).<em> (default: <code>{}</code>)</em>| No







### post


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


<code>post(data)</code>
  


<p>
  <b>Returns:</b> <code>string</code> The id of the posted message.
</p>

Posts data in your local storage and return the `reference` of the new document.
Then use the [sync method](#api-reference-clearroad-sync) to synchronize the data with the ClearRoad API.

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
data | <code>postData</code> | The message to post. Each `value` paired with a `key` must be a `string`.| Yes

### state


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


<code>state(id)</code>
  


<p>
  <b>Returns:</b> <code>ValidationStates</code> The [state](#api-reference-clearroad-enums-validationstates) of the message.
</p>

Check for the processing state of the message.
Allow some time after [synchronizing](#api-reference-clearroad-sync) before checking for the state.

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
id | <code>string</code> | The id of the message.| Yes

### sync


```javascript
cr.sync();
```


<code>sync(progress)</code>
  


<p>
  <b>Returns:</b> <code>IQueue&lt;void&gt;</code> 
</p>

Synchronizes the local storage with the ClearRoad Platform (will make sure both storage contain the same data).

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
progress | <code>syncProgressCallback</code> | Function to get notified of progress. There are 4 storages to sync.<em> (default: <code>() =&gt; { }</code>)</em>| No

### queryByState


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


<code>queryByState(state,&nbsp;options)</code>
  


<p>
  <b>Returns:</b> <code>IQueue&lt;IJioQueryResults&gt;</code> Search results.
</p>

Retrieve the messages in a certain "processing" state.
By default, when a message is not yet synchronized or processed, the state is `not_processed`.

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
state | <code>ValidationStates</code> | State of the message.| Yes
options | <code>Partial&lt;IJioQueryOptions&gt;</code> | Set { sort_on, limit } on the results.<em> (default: <code>{}</code>)</em>| No

### allDocs


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


<code>allDocs(options)</code>
  


<p>
  <b>Returns:</b> <code>IQueue&lt;IJioQueryResults&gt;</code> Search results.
</p>

Query for documents in the local storage. Make sure `.sync()` is called before.

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
options | <code>IJioQueryOptions</code> | Query [options](#api-reference-clearroad-interfaces-ijioqueryoptions). If none set, return all documents.| No

### getReportFromRequest


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


<code>getReportFromRequest(sourceReference)</code>
  


<p>
  <b>Returns:</b> <code>IQueue&lt;any&gt;</code> The report as JSON.
</p>

Get a report using the Report Request reference.

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
sourceReference | <code>string</code> | The reference of the Report Request.| Yes

### getReport


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


<code>getReport(reference)</code>
  


<p>
  <b>Returns:</b> <code>IQueue&lt;any&gt;</code> The report as JSON.
</p>

Retrieve [the report](https://api.clearroadlab.io/docs/#requesting-a-report) with the given report `reference`.
If you only have the `reference` of the report request, please use [getReportFromRequest](#api-reference-clearroad-getreportfromrequest) instead.

Param | Type | Description | Required
--------- | ----------- | ----------- | -----------
reference | <code>string</code> | The reference of the Report.| Yes





### Enums


#### LocalStorageTypes


Note: this list does not contain the additional Node.js storages developped by ClearRoad available [here](https://github.com/clearroad/clearroad-api-storages).


Key | Value | Description
--------- | ----------- | -----------
indexeddb | `'indexeddb'` | Native Browser IndexedDB storage.
dropbox | `'dropbox'` | Storage data in a dropbox account. Need `accessToken`.
gdrive | `'gdrive'` | Storage data in a google drive account. Need `accessToken`.


#### PortalTypes


Each message is represented by a "portal_type" (or message category)


Key | Value | Description
--------- | ----------- | -----------
BillingPeriodMessage | `'Billing Period Message'` | 
File | `'File'` | 
OdometerReading | `'Odometer Reading'` | 
OdometerReadingMessage | `'Odometer Reading Message'` | 
RoadAccount | `'Road Account'` | 
RoadAccountMessage | `'Road Account Message'` | 
RoadEvent | `'Road Event'` | 
RoadEventMessage | `'Road Event Message'` | 
RoadMessage | `'Road Message'` | 
RoadReportRequest | `'Road Report Request'` | 
RoadTransaction | `'Road Transaction'` | 
RoadMileageMessage | `'Road Mileage Message'` | 


#### ValidationStates


When a message is processed by the ClearRoad platform, it will create a new message with a validation state.


Key | Value | Description
--------- | ----------- | -----------
Processed | `'processed'` | Message has been processed by the ClearRoad platform.
Rejected | `'rejected'` | Message has been rejected by the ClearRoad platform. A `comment` will be added explaining the reason.
Submitted | `'submitted'` | Message has been submitted to the ClearRoad platform but still processing.
Unprocessed | `'not_processed'` | When the message has not been sent to the ClearRoad platform yet, the state is "not_processed".


#### GroupingReferences



Key | Value | Description
--------- | ----------- | -----------
Data | `'data'` | Message created in the local storage.
Report | `'report'` | Message created on the ClearRoad platform.








### Interfaces


#### IClearRoadOptions



Property | Type | Description | Optional
--------- | ----------- | ----------- | -----------
localStorage | <code>IClearRoadOptionsLocalStorage</code> | Options for the local storage. View [IClearRoadOptionsLocalStorage](#api-reference-clearroad-interfaces-iclearroadoptionslocalstorage). | Yes
minDate | <code>Date&#124;number&#124;string</code> | Messages updated before this date will not be synchronized. If not set, all messages will be synchronized. Improves speed of synchronisation for big sets. | Yes
syncPortalTypes | <code>PortalTypes[]</code> | View [PortalTypes](#api-reference-clearroad-enums-portaltypes). Defines which types of messages to synchronize. If not set, all messages will be synchronized. Improves speed of synchronisation for big sets. | Yes
maxSyncObjects | <code>number</code> | Maximum number of objects that will be sycnrhonized from the ClearRoad platform to the local storage. Default is `1234567890`. | Yes
useQueryStorage | <code>boolean</code> | Force using a query storage around the localStorage. Needed if the storage can not query data directly. See information on the storage. | Yes
debug | <code>boolean</code> | Log to console replication steps between local and remote storage. | Yes


#### IClearRoadOptionsLocalStorage



Property | Type | Description | Optional
--------- | ----------- | ----------- | -----------
type | <code>LocalStorageTypes&#124;string</code> | Type of the storage. View [LocalStorageTypes](#api-reference-clearroad-enums-localstoragetypes). | No
accessToken | <code>string</code> | Access token to authenticate on the ClearRoad API (if necessary). | Yes
database | <code>string</code> | Name of the database when the objects will be stored. | Yes


#### IJioQueryOptions



Property | Type | Description | Optional
--------- | ----------- | ----------- | -----------
query | <code>string</code> | Search with a query. Refer to the jIO documentation in the jIO Query Engine section for details. | No
limit | <code>[number, number]</code> | Limit the results. Leave empty for no limit. | Yes
sort_on | <code>JioQuerySortProperty[]</code> | List of fields to sort on, each specifying the order with ascending/descending. Example: `[['date', 'ascending'], ['id', 'descending]]` | Yes
select_list | <code>string[]</code> | When provided, the response has a `value` containing the values of these keys for each document. | Yes
include_docs | <code>boolean</code> | When `true`, the response has a `doc` containing the full metadata for each document. | Yes


#### IJioQueryResults



Property | Type | Description | Optional
--------- | ----------- | ----------- | -----------
data | <code>IJioQueryResultsData</code> | The result [data](#api-reference-clearroad-interfaces-ijioqueryresultsdata). | No


#### IJioQueryResultsData



Property | Type | Description | Optional
--------- | ----------- | ----------- | -----------
rows | <code>IJioQueryResultRow[]</code> | List of [result row](#api-reference-clearroad-interfaces-ijioqueryresultrow). | No
total_rows | <code>number</code> | The total number of results. | No


#### IJioQueryResultRow



Property | Type | Description | Optional
--------- | ----------- | ----------- | -----------
id | <code>string</code> | Document id | No
doc | <code>any</code> | Original document value. | Yes
value | <code>any</code> | Filtered properties of the document. | Yes


#### IQueue



Property | Type | Description | Optional
--------- | ----------- | ----------- | -----------
push | <code>IQueue&lt;TResult1&#124;TResult2&gt;</code> | Similar to `Promise` but can be cancelled. | No








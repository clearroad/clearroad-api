# SDK reference

The `ClearRoad` class contains a subset of functions from the [jio.js](https://jio.nexedi.com/) library, which uses [RSVP.js](https://lab.nexedi.com/nexedi/rsvp.js) to chain functions like Promises.

## constructor

```javascript
new ClearRoad('apiUrl', 'accessToken');
```

`new ClearRoad(url, accessToken, options)`

Initialise a new ClearRoad object to interact with the ERP5 storage.

Property | Description
--------- | -----------
url | Url of the storage
accessToken | Optional. Access token to authenticate on ERP5 (if necessary)
options.localStorage.type | View [types](#local-storage-types) below
options.localStorage.accessToken | Access token (if required)

### Local Storage Types

Type | Description | Options | Support | Need access token
--------- | --------- | ----------- | ----------- | -----------
indexeddb | Native Browser IndexedDB storage | type: string | Browser only | No
dropbox | Storage data in a dropbox account | type: string, accessToken: string | Browser and Node | Yes
gdrive | Storage data in a google drive account | type: string, accessToken: string | Browser and Node | Yes

## post

```javascript
cr.post({
  key1: "value",
  key2: JSON.stringify({
    "subkey": "subvalue"
  })
});
```

`post(data)`

Posts data in your local storage. Use the [sync method](#sync) then to synchronize the data to the ClearRoad API.

Property | Description
--------- | -----------
data | Data to post. Each `value` paired with a `key` must be a `string`.

## sync

```javascript
cr.sync();
```

`sync()`

Similar to the `repair` method of `jio`, this will synchronize or repair the storage and all data within.

## allDocs

> Query the documents:

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

`allDocs({query, limit, sort_on, select_list, include_docs})`

Retrieve a list of documents.

Property | Description
--------- | -----------
query | Refer to the [jio documentation](https://jio.nexedi.com/) in the **jIO Query Engine** section for details
limit (optional) | Limit the results. Leave empty for no limit, or `[min, max]` for paging
sort_on (optional) | List of fields to sort on, each specifying the order with `ascending`/`descending`
select_list | When provided, the response has a `value` containing the values of these keys for each document
include_docs | When `true`, the response has a `doc` containing the full metadata for each document

## getReport

```javascript--browser
cr.getReport(id).then(function(report) {
  // read report
})
```

```javascript--browser-es6
const report = await cr.getReport(id);
```

```javascript--node
const report = await cr.getReport(id);
```

`getReport(id)`

Retrieve the report with the given `id`.

Property | Description
--------- | -----------
id | Id (reference) of the report

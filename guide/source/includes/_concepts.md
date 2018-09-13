# Concepts

## Pushing data to ClearRoad API

> The storage must first be instantiated:

```javascript
const cr = new ClearRoad('APIUrl', 'accessToken');
```

> Data can then be pushed on the storage using the post method, and then data is synchronized with the ClearRoad platform using:

```javascript--browser
(function(ClearRoad) {
  cr.post(data)
    .push(function() {
      return cr.sync();
    })
    .push(function() {
      console.log('sync done');
    });
})(ClearRoad);
```

```javascript--browser-es6
await cr.post(data);
await cr.sync();
console.log('sync done');
```

```javascript--node
await cr.post(data);
await cr.sync();
console.log('sync done');
```

Pushing data to ClearRoad is done by [posting it](#post) in a local storage and [synchronizing](#sync) that storage with the ClearRoad API.

## Retrieving data from ClearRoad API

> The storage must first be instantiated:

```javascript
const cr = new ClearRoad('APIUrl', 'accessToken');
```

> Then create a query on the `portal_type` that you want:

```javascript--browser
(function(ClearRoad) {
  cr.allDocs({
    query: 'grouping_reference: "report" AND portal_type:"Road Account Message"',
    select_list: ['source_reference', 'state', 'comment']
  }).push(result => {
    for (let i = 0; i < result.data.total_rows; i++) {
      var ref = result.data.rows[i].value.source_reference;
      var state = result.data.rows[i].value.state;
      var comment = result.data.rows[i].value.comment;
      ...
    }
  });
})(ClearRoad);
```

```javascript--browser-es6
const result = await cr.allDocs({
  query: 'grouping_reference: "report" AND portal_type:"Road Account Message"',
  select_list: ['source_reference', 'state', 'comment']
});
result.data.rows.forEach(row => {
  const ref = row.value.source_reference;
  const state = row.value.state;
  const comment = row.value.comment;
  ...
});
```

```javascript--node
const result = await cr.allDocs({
  query: 'grouping_reference: "report" AND portal_type:"Road Account Message"',
  select_list: ['source_reference', 'state', 'comment']
});
result.data.rows.forEach(row => {
  const ref = row.value.source_reference;
  const state = row.value.state;
  const comment = row.value.comment;
  ...
});
```

After [pushing data](#pushing-data-to-clearroad-api) to the API, you can retrieve it using the [cr.allDocs](#alldocs) function.

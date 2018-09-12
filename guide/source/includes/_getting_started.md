# QuickStart

## Step 1. Install the library as dependency

We are using `npm` to install the `ClearRoad` api library.
Open a terminal window in your project and nstall the dependency using the command:

<div class="full-column"></div>
```shell
npm i @clearroad/api -S
```

If you want to include the files directly in your page, you can include via our CDN:

<div class="full-column"></div>
```html
<script src="https://clearroadlab.azureedge.net/lib/rsvp.js"></script>
<script src="https://clearroadlab.azureedge.net/lib/jio.js"></script>
<script src="https://clearroadlab.azureedge.net/api/clearroad.js"></script>
```

## Step 2. Create a new ClearRoad instance

```javascript--browser
(function(ClearRoad) {
  const cr = new ClearRoad('apiUrl', 'accessToken');
})(ClearRoad);
```

```javascript--browser-es6
import { ClearRoad } from '@clearroad/api';
const cr = new ClearRoad('apiUrl', 'accessToken');
```

```javascript--node
const ClearRoad = require('@clearroad/api/node').ClearRoad;
const cr = new ClearRoad('apiUrl', 'accessToken');
```

To create an instance, you will need to have the `apiUrl` (the url of the ClearRoad API instance) and an `accessToken`.
If you do not have an access token, you can request one on the [developer platform](https://api.clearroadlab.io/developer/).

## Step 3. Choose a local storage

```javascript--browser
const cr = new ClearRoad('apiUrl', 'accessToken', {
  type: 'indexeddb'
});
```

```javascript--node
// if using .env
CLEARROAD_URL=<url>
CLEARROAD_ACCESS_TOKEN=<access token>
DROPBOX_ACCESS_TOKEN=<access token>

const dotenv = require('dotenv');
dotenv.config();
const cr = new ClearRoad(process.env.CLEARROAD_URL, process.env.CLEARROAD_ACCESS_TOKEN, {
  localStorage: {
    type: 'dropbox',
    accessToken: process.env.DROPBOX_ACCESS_TOKEN
  }
});
```

The ClearRoad API is based on a synchronization process, which will effectively synchronize data from the API to a "local" storage. This local storage can be on a local server, on the browser, or on a remote server.

By default, the api will use `indexeddb` as local storage. If you want to change the storage (or if you are using node and you need to), please refer to [the ClearRoad reference](#constructor).

## Step 4. Retrieve messages

```javascript--browser
cr.sync()
  .then(function() {
    console.log('sync done');
    return cr.allDocs();
  })
  .then(function(results) {
    console.log(results);
  });
```

```javascript--browser-es6
await cr.sync();
console.log('sync done');
const results = await cr.allDocs();
console.log(results);
```

```javascript--node
await cr.sync();
const results = await cr.allDocs();
```

Now that you're all setup, you can start by synchronizing your local storage and then query the data.

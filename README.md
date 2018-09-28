# ClearRoad API SDK

[![Build Status](https://gitlab.com/clearroad/api/badges/master/pipeline.svg)](https://gitlab.com/clearroad/api/commits/master)
[![Travis-CI Status](https://travis-ci.org/clearroad/clearroad-api.svg?branch=master)](https://travis-ci.org/clearroad/clearroad-api)
[![Coverage Status](https://coveralls.io/repos/github/clearroad/clearroad-api/badge.svg?branch=master)](https://coveralls.io/github/clearroad/clearroad-api?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![npm version](https://badge.fury.io/js/%40clearroad%2Fapi.svg)](https://badge.fury.io/js/%40clearroad%2Fapi)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

## <a name="install"></a> Install

```sh
$ npm install @clearroad/api
```

## <a name="usage"></a> Usage

If you want to include the files directly in your page, you can include via our CDN:
```html
<script src="https://clearroadlab.azureedge.net/lib/rsvp.js"></script>
<script src="https://clearroadlab.azureedge.net/lib/jio.js"></script>
<script src="https://clearroadlab.azureedge.net/api/clearroad.js"></script>
```

### Using with es6

```javascript
import { ClearRoad } from '@clearroad/api';
const cr = new ClearRoad('apiUrl', 'accessToken');
```

### Using with CommonJS

```javascript
const ClearRoad = require('@clearroad/api').ClearRoad;
const cr = new ClearRoad('apiUrl', 'accessToken');
```

### Using with Node

```javascript
const ClearRoad = require('@clearroad/api/node').ClearRoad;
const cr = new ClearRoad('apiUrl', 'accessToken');
```

#### Samples

You can find the following samples using the ClearRoad API SDK with node:

- [api-node-samples](https://github.com/clearroad/clearroad-api-node-samples): posting and syncing simple data

### Using a different local storage

By default, the api will use `indexeddb` as local storage. If you want to change the storage (or if you are using node and you need to), you can use:
```javascript
const cr = new ClearRoad('apiUrl', 'accessToken', {
  localStorage: {
    type: 'dropbox',
    accessToken: 'accessToken'
  }
});
```

`options.localStorage.types`

Type | Description | Options | Support | Need access token
--------- | --------- | ----------- | ----------- | -----------
indexeddb | Native Browser IndexedDB storage | type: string | Browser only | No
dropbox | Storage data in a dropbox account | type: string, accessToken: string | Browser and Node | Yes
gdrive | Storage data in a google drive account | type: string, accessToken: string | Browser and Node | Yes

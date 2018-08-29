# ClearRoad API

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## <a name="install"></a> Install

```javascript
$ npm install clearroad-api
```

## <a name="usage"></a> Usage

### Using with es6

```javascript
import { ClearRoad } from 'clearroad-api';
const cr = new ClearRoad('apiUrl', 'login', 'password');
```

### Using with CommonJS

```javascript
const ClearRoad = require('clearroad-api').ClearRoad;
const cr = new ClearRoad('apiUrl', 'login', 'password');
```

### Using with Node

```javascript
const ClearRoad = require('clearroad-api/node').ClearRoad;
const cr = new ClearRoad('apiUrl', 'login', 'password');
```

### Using a different local storage

By default, the api will use `indexeddb` as local storage. If you want to change the storage (or if you are using node and you need to), you can use:
```javascript
const cr = new ClearRoad('apiUrl', 'login', 'password', {
  type: 'dropbox',
  accessToken: 'accessToken'
});
```

The options are:

Type | Description | Options | Support | Need access token
--------- | --------- | ----------- | ----------- | -----------
indexeddb | Native Browser IndexedDB storage | type: string | Browser only | No
dropbox | Storage data in a dropbox account | type: string, accessToken: string | Browser and Node | Yes
gdrive | Storage data in a google drive account | type: string, accessToken: string | Browser and Node | Yes

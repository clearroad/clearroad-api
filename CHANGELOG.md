# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.2.0"></a>
# [2.2.0](https://github.com/clearroad/clearroad-api/compare/v2.1.0...v2.2.0) (2018-11-01)


### Bug Fixes

* **jio:** fix convert ArrayBuffer to Blob on ajax response ([f0a3216](https://github.com/clearroad/clearroad-api/commit/f0a3216))


### Features

* **clearroad:** return report as JSON ([36f3ac9](https://github.com/clearroad/clearroad-api/commit/36f3ac9))



<a name="2.1.0"></a>
# [2.1.0](https://github.com/clearroad/clearroad-api/compare/v2.0.0...v2.1.0) (2018-11-01)


### Features

* **clearroad:** add options to wrap storage in QueryStorage ([9005d2b](https://github.com/clearroad/clearroad-api/commit/9005d2b))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/clearroad/clearroad-api/compare/v1.2.0...v2.0.0) (2018-10-30)


### Bug Fixes

* **clearroad:** export PortalTypes ([299678c](https://github.com/clearroad/clearroad-api/commit/299678c))
* **clearroad:** fallback to allAttachments on error ([edb4f7d](https://github.com/clearroad/clearroad-api/commit/edb4f7d))
* **clearroad:** handle request properties as objects ([4a33730](https://github.com/clearroad/clearroad-api/commit/4a33730))
* **clearroad:** update jio lib when using require ([cafe36f](https://github.com/clearroad/clearroad-api/commit/cafe36f))
* **definitions:** update descriptions and remove empty default ([2962510](https://github.com/clearroad/clearroad-api/commit/2962510))
* **jio node:** handle responseType == 'blob' ([32f9d9f](https://github.com/clearroad/clearroad-api/commit/32f9d9f))
* **xhr2:** support FormData ([68689d2](https://github.com/clearroad/clearroad-api/commit/68689d2))


### Chores

* **clearroad:** use commonjs bundle for node ([bd37ea6](https://github.com/clearroad/clearroad-api/commit/bd37ea6))


### Features

* **clearroad:** add jio storage definitions ([0e3035a](https://github.com/clearroad/clearroad-api/commit/0e3035a))
* **clearroad:** handle additional storages ([7155337](https://github.com/clearroad/clearroad-api/commit/7155337))
* **clearroad:** set options.database to override default db name ([baaffaf](https://github.com/clearroad/clearroad-api/commit/baaffaf))
* **definitions:** add message definitions ([5d43147](https://github.com/clearroad/clearroad-api/commit/5d43147))


### BREAKING CHANGES

* **clearroad:** use require('@clearroad/api') for Node.js



<a name="1.2.0"></a>
# [1.2.0](https://github.com/clearroad/clearroad-api/compare/v1.1.1...v1.2.0) (2018-09-13)


### Features

* **clearroad:** add getReportFromRequest method ([e1308fd](https://github.com/clearroad/clearroad-api/commit/e1308fd))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/clearroad/clearroad-api/compare/v1.1.0...v1.1.1) (2018-09-12)


### Bug Fixes

* **clearroad:** fix config with dropbox ([7fa0364](https://github.com/clearroad/clearroad-api/commit/7fa0364))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/clearroad/clearroad-api/compare/v1.0.0...v1.1.0) (2018-09-06)


### Bug Fixes

* **clearroad:** fix wrong config reports ([ed80f5a](https://github.com/clearroad/clearroad-api/commit/ed80f5a))


### Features

* **clearroad:** synchronize all storages in parallel ([4693a11](https://github.com/clearroad/clearroad-api/commit/4693a11))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/clearroad/clearroad-api/compare/v0.1.0...v1.0.0) (2018-09-04)


### Features

* **clearroad:** use accessToken instead of login and password ([4aca062](https://github.com/clearroad/clearroad-api/commit/4aca062))


### BREAKING CHANGES

* **clearroad:** replace login and password with access token



<a name="0.1.0"></a>
# [0.1.0](https://github.com/clearroad/clearroad-api/compare/v0.0.1...v0.1.0) (2018-08-31)


### Features

* **clearroad:** add sync progress callback ([27b9b40](https://github.com/clearroad/clearroad-api/commit/27b9b40))
* **es6:** export api as es6 module ([ddc292b](https://github.com/clearroad/clearroad-api/commit/ddc292b))



<a name="0.0.1"></a>
## 0.0.1 (2018-08-29)

First release of the lib.

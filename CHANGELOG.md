# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.0.0"></a>
# [3.0.0](https://github.com/clearroad/clearroad-api/compare/v2.7.0...v3.0.0) (2019-01-23)


### Bug Fixes

* guide/Gemfile & guide/Gemfile.lock to reduce vulnerabilities ([182f19d](https://github.com/clearroad/clearroad-api/commit/182f19d))
* **jio:** update branch for release ([1eb9ac7](https://github.com/clearroad/clearroad-api/commit/1eb9ac7))


### BREAKING CHANGES

* **jio:** version 2.x outdated



<a name="2.7.0"></a>
# [2.7.0](https://github.com/clearroad/clearroad-api/compare/v2.6.0...v2.7.0) (2018-12-14)


### Bug Fixes

* **clearroad:** export PortalTypes ([31b1fe5](https://github.com/clearroad/clearroad-api/commit/31b1fe5))
* **definitions:** remove wrong patterns on road account message ([feb4da8](https://github.com/clearroad/clearroad-api/commit/feb4da8))


### Features

* **clearroad:** add maxSyncedObjects option ([aaa511a](https://github.com/clearroad/clearroad-api/commit/aaa511a))
* **clearroad:** add option to filter portal types for sync ([531bdd4](https://github.com/clearroad/clearroad-api/commit/531bdd4))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/clearroad/clearroad-api/compare/v2.5.0...v2.6.0) (2018-12-06)


### Bug Fixes

* **clearroad:** use options.minDate to restrict sync in time ([a7a4a14](https://github.com/clearroad/clearroad-api/commit/a7a4a14))


### Features

* **clearroad:** add method to query messages by state ([f469f98](https://github.com/clearroad/clearroad-api/commit/f469f98))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/clearroad/clearroad-api/compare/v2.4.1...v2.5.0) (2018-11-22)


### Features

* **clearroad:** add state function ([c03bc9a](https://github.com/clearroad/clearroad-api/commit/c03bc9a))
* **definitions:** add event types ([edbe63a](https://github.com/clearroad/clearroad-api/commit/edbe63a))
* **definitions:** add mrd types ([ed90ceb](https://github.com/clearroad/clearroad-api/commit/ed90ceb))
* **definitions:** add rules and subrules ([6e02702](https://github.com/clearroad/clearroad-api/commit/6e02702))



<a name="2.4.1"></a>
## [2.4.1](https://github.com/clearroad/clearroad-api/compare/v2.4.0...v2.4.1) (2018-11-12)


### Bug Fixes

* fix version mismatch of form-data ([e39df8a](https://github.com/clearroad/clearroad-api/commit/e39df8a))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/clearroad/clearroad-api/compare/v2.3.0...v2.4.0) (2018-11-07)


### Bug Fixes

* **clearroad:** fix error in definitions ([1d24f34](https://github.com/clearroad/clearroad-api/commit/1d24f34))
* **jio:** remove unused login/password auth on ERP5Storage ([74ab3ca](https://github.com/clearroad/clearroad-api/commit/74ab3ca))


### Features

* **jio:** use node version from repo ([9804188](https://github.com/clearroad/clearroad-api/commit/9804188))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/clearroad/clearroad-api/compare/v2.2.0...v2.3.0) (2018-11-05)


### Features

* **clearroad:** add debug option ([798951a](https://github.com/clearroad/clearroad-api/commit/798951a))



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

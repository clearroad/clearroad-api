"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = require('rsvp').Queue;
exports.getQueue = function () { return new Queue(); };
exports.promiseToQueue = function (promise) { return promise; };

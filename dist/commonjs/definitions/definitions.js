"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var billing_period_message_1 = require("./billing-period-message");
var odometer_reading_message_1 = require("./odometer-reading-message");
var road_account_message_1 = require("./road-account-message");
var road_event_message_1 = require("./road-event-message");
var road_message_1 = require("./road-message");
var road_report_request_1 = require("./road-report-request");
exports.definitions = {
    'Billing Period Message': billing_period_message_1.default,
    'Odometer Reading Message': odometer_reading_message_1.default,
    'Road Account Message': road_account_message_1.default,
    'Road Event Message': road_event_message_1.default,
    'Road Message': road_message_1.default,
    'Road Report Request': road_report_request_1.default,
    'Road Mileage Message': road_report_request_1.default
};

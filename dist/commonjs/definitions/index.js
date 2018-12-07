"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require('ajv');
/**
 * Each message is represented by a "portal_type" (or message category)
 */
var PortalTypes;
(function (PortalTypes) {
    PortalTypes["BillingPeriodMessage"] = "Billing Period Message";
    PortalTypes["File"] = "File";
    PortalTypes["RoadAccount"] = "Road Account";
    PortalTypes["RoadAccountMessage"] = "Road Account Message";
    PortalTypes["RoadEvent"] = "Road Event";
    PortalTypes["RoadEventMessage"] = "Road Event Message";
    PortalTypes["RoadMessage"] = "Road Message";
    PortalTypes["RoadReportRequest"] = "Road Report Request";
    PortalTypes["RoadTransaction"] = "Road Transaction";
})(PortalTypes = exports.PortalTypes || (exports.PortalTypes = {}));
var definitions_1 = require("./definitions");
exports.validateDefinition = function (type, data) {
    var definition = definitions_1.definitions[type];
    // check type
    if (!definition) {
        throw new Error("portal_type: \"" + type + "\" not found");
    }
    var ajv = new Ajv({
        allErrors: true
    });
    var validate = ajv.compile(definition);
    var valid = validate(data);
    if (!valid) {
        throw new Error("Validation schema failed:\n" + ajv.errorsText(validate.errors));
    }
    return valid;
};

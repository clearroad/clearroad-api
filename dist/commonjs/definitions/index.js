"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require('ajv');
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

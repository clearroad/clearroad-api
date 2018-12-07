const Ajv = require('ajv');
/**
 * Each message is represented by a "portal_type" (or message category)
 */
export var PortalTypes;
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
})(PortalTypes || (PortalTypes = {}));
import { definitions } from './definitions';
export const validateDefinition = (type, data) => {
    const definition = definitions[type];
    // check type
    if (!definition) {
        throw new Error(`portal_type: "${type}" not found`);
    }
    const ajv = new Ajv({
        allErrors: true
    });
    const validate = ajv.compile(definition);
    const valid = validate(data);
    if (!valid) {
        throw new Error(`Validation schema failed:\n${ajv.errorsText(validate.errors)}`);
    }
    return valid;
};
//# sourceMappingURL=index.js.map
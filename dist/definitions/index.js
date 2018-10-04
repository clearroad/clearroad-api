const Ajv = require('ajv');
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
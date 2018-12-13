const request = require('request-promise-native');
const fs = require('fs');

const baseUrl = process.env.BASE_URL || 'https://erp5.clearroadev.xyz';
const url = baseUrl + '/portal_types/${type}/getTextContent';

const definitions = [
  'Billing Period Message',
  'Road Account Message',
  'Road Event Message',
  'Road Message',
  'Road Report Request'
];

const definitionInterfaceName = type => type.replace(/\s/g, '');
const definitionFilename = type => type.toLowerCase().replace(/\s/g, '-');
const definitionVariable = type => {
  return type.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
};

const getDefinition = async type => {
  const uri = url.replace('${type}', encodeURIComponent(type));
  console.log(`Fetching definition: ${uri}`);
  return await request({
    uri,
    json: true
  });
};

const definitionExample = (definition, value) => {
  const source = value.$ref ? definition.definitions[value.$ref.split('/').pop()] : value;
  const example = (source.examples && source.examples[0]) || '';
  return example ? (source.type === 'string' ? `'${example}'` : example) : '';
};

const definitionProperties = (definitions, definition, level) => {
  return Object.keys(definition.properties).filter(key => key !== 'portal_type').map(key => {
    const value = definition.properties[key];
    const required = definition.required.some(val => val === key);
    let example = definitionExample(definitions, value);
    if (example) {
      example = `${'  '.repeat(level)} * @example ${example}`;
    }
    let description = value.description;
    let property = `${key}${required ? '' : '?'}`;
    if (description) {
      description = `${'  '.repeat(level)}/**
${'  '.repeat(level)} * ${description}${example ? `\n${example}` : ''}
${'  '.repeat(level)} */`;
    }
    property = `${description ? `${description}\n`: ''}${'  '.repeat(level)}${property}`;

    let type = value.type || 'string';
    if (type === 'object') {
      return `${property}: {
${definitionProperties(definitions, value, level + 1)}
${'  '.repeat(level)}};`;
    }
    else if (type === 'array') {
      return `${property}: Array<{
${definitionProperties(definitions, value.items, level + 1)}
${'  '.repeat(level)}}>;`;
    }
    else if (type === 'integer') {
      type = 'number';
    }
    return `${property}: ${type};`;
  }).join(`\n`);
};

const removeComments = value => {
  delete value.$comment;
  Object.keys(value).forEach(key => {
    if (typeof value[key] === 'object') {
      removeComments(value[key]);
    }
  });
};

const writeDefinition = async (type) => {
  const value = await getDefinition(type);
  removeComments(value);
  const jsonString = JSON.stringify(value, null, 2);
  const portalType = definitionInterfaceName(type);
  const properties = definitionProperties(value, value, 1);
  const content = `import { IDefinition, IPostData } from './index';
import { PortalTypes } from '../message-types';
const json: IDefinition = ${jsonString.replace(/"/g, "'")};
export default json;
export interface IPost${portalType} extends IPostData {
  portal_type: PortalTypes.${portalType};
${properties}
}
`;
  fs.writeFileSync(`src/definitions/${definitionFilename(type)}.ts`, content);
  fs.writeFileSync(`definitions/${definitionFilename(type)}.json`, jsonString);
};

const writeDefinitionIndex = () => {
  const content = `import { portalType } from '../message-types';
import { IDefinition } from './index';

${definitions.map(type => {
  return `import ${definitionVariable(type)} from './${definitionFilename(type)}';`;
}).join('\n')}

export const definitions: {
  [type in portalType]: IDefinition;
} = {
  ${definitions.map(type => {
    return `'${type}': ${definitionVariable(type)}`;
  }).join(',\n  ')}
};
`;

  fs.writeFileSync('src/definitions/definitions.ts', content);
};

const writeInterfaces = () => {
  const content = `${definitions.map(type => {
  return `import { IPost${definitionInterfaceName(type)} } from './${definitionFilename(type)}';
export { IPost${definitionInterfaceName(type)} };`;
}).join('\n')}

export type postData = ${definitions.map(type => {
  return `IPost${definitionInterfaceName(type)}`;
}).join(' |\n  ')};
`;

  fs.writeFileSync('src/definitions/interfaces.ts', content);
};

const run = async () => {
  try {
    writeDefinitionIndex();
    writeInterfaces();
    await Promise.all(definitions.map(writeDefinition));

    process.exit(0);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();

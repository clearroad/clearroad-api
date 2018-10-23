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

const definitionFilename = (type) => type.toLowerCase().replace(/\s/g, '-');
const definitionVariable = (type) => {
  return type.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
};

const getDefinition = async (type) => {
  const uri = url.replace('${type}', encodeURIComponent(type));
  console.log(`Fetching definition: ${uri}`);
  return await request({
    uri,
    json: true
  });
};

const writeDefinition = async (type) => {
  const value = await getDefinition(type);
  const content = `import { IDefinition } from './index';
const json: IDefinition = ${JSON.stringify(value, null, 2).replace(/"/g, "'")};
export default json;
`;
  fs.writeFileSync(`src/definitions/${definitionFilename(type)}.ts`, content);
  fs.writeFileSync(`definitions/${definitionFilename(type)}.json`, JSON.stringify(value, null, 2));
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
}

const run = async () => {
  try {
    writeDefinitionIndex();
    await Promise.all(definitions.map(writeDefinition));

    process.exit(0);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();

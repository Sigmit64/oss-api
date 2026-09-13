import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import SwaggerParser from '@apidevtools/swagger-parser';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import YAML from 'yaml';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const specs = resolve(root, 'public/specs');
const openapiPath = resolve(specs, 'oss-funder-current-v1.yaml');
const openapiText = await readFile(openapiPath, 'utf8');
YAML.parse(openapiText);
await SwaggerParser.validate(openapiPath);

const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);
const moduleDir = resolve(specs, 'modules');
const files = (await readdir(moduleDir)).filter((file) => file.endsWith('.schema.json')).sort();
if (files.length !== 3) throw new Error(`期望 3 个模块 Schema，实际找到 ${files.length} 个`);
for (const file of files) {
  const schema = JSON.parse(await readFile(resolve(moduleDir, file), 'utf8'));
  ajv.compile(schema);
  console.log(`通过 JSON Schema 校验：${file}`);
}
console.log('通过 OpenAPI YAML 解析、引用和 JSON Schema 编译校验');

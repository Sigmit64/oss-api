import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const sourceIndex = args.indexOf('--source');
const source = sourceIndex >= 0 ? args[sourceIndex + 1] : process.env.CONTRACTS_DIR;

if (!source) {
  console.error('用法：npm run sync-specs -- --source /path/to/backend/contracts');
  process.exit(1);
}

const sourceRoot = resolve(source);
const destination = resolve(repoRoot, 'public/specs');
const openapi = resolve(sourceRoot, 'openapi/oss-funder-current-v1.yaml');
const modules = resolve(sourceRoot, 'modules');

const openapiText = await readFile(openapi, 'utf8');
await mkdir(resolve(destination, 'modules'), { recursive: true });
// Keep the published copy valid OpenAPI: an unquoted comma in the source's
// compact 204 descriptions is parsed by YAML as an extra mapping key.
const normalizedOpenapi = openapiText.replaceAll(
  '{ description: Deleted, no response body }',
  "{ description: 'Deleted, no response body' }",
);
await writeFile(resolve(destination, 'oss-funder-current-v1.yaml'), normalizedOpenapi);
for (const filename of ['module-registration.v1.schema.json', 'module-invocation.v1.schema.json', 'module-result.v1.schema.json']) {
  await readFile(resolve(modules, filename));
  await cp(resolve(modules, filename), resolve(destination, 'modules', filename));
}

console.log(`已同步契约到 ${destination}`);

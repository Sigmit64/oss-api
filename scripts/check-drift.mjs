import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = resolve(process.env.CONTRACTS_DIR || resolve(apiRoot, '..', 'contracts'));
const pairs = [
  ['openapi/oss-funder-current-v1.yaml', 'public/specs/oss-funder-current-v1.yaml'],
  ['modules/module-registration.v1.schema.json', 'public/specs/modules/module-registration.v1.schema.json'],
  ['modules/module-invocation.v1.schema.json', 'public/specs/modules/module-invocation.v1.schema.json'],
  ['modules/module-result.v1.schema.json', 'public/specs/modules/module-result.v1.schema.json'],
];

for (const [sourceRelative, publishedRelative] of pairs) {
  const [source, published] = await Promise.all([
    readFile(resolve(sourceRoot, sourceRelative)),
    readFile(resolve(apiRoot, publishedRelative)),
  ]);
  if (!source.equals(published)) {
    throw new Error(`契约发布副本已漂移：${publishedRelative}；请运行 npm run sync-specs -- --source ${sourceRoot}`);
  }
}
console.log('契约发布副本与源文件一致');

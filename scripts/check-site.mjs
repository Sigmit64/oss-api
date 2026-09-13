import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const dist = resolve(root, 'dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');

if (!html.includes('./assets/')) throw new Error('index.html 未使用可部署的相对资源路径');
if (!html.includes('<div id="swagger-ui"></div>')) throw new Error('页面缺少原生 Swagger UI 容器');
for (const deletedElement of ['site-header', 'hero', 'contract-grid', 'site-footer']) {
  if (html.includes(deletedElement)) throw new Error(`页面仍包含已删除的装饰元素：${deletedElement}`);
}
for (const deletedText of ['CURRENT', 'TARGET', '把代码仓库分析能力接入你的工具链', '阅读提示']) {
  if (html.includes(deletedText)) throw new Error(`页面仍包含已删除的宣传文字：${deletedText}`);
}
for (const path of [
  'specs/oss-funder-current-v1.yaml',
  'specs/modules/module-registration.v1.schema.json',
  'specs/modules/module-invocation.v1.schema.json',
  'specs/modules/module-result.v1.schema.json',
]) {
  await access(resolve(dist, path));
}
const assets = await readdir(resolve(dist, 'assets'));
const jsFiles = assets.filter((file) => file.endsWith('.js'));
if (jsFiles.length === 0) throw new Error('构建结果缺少 JavaScript 资源');
const js = await readFile(resolve(dist, 'assets', jsFiles[0]), 'utf8');
if (!js.includes('./specs/oss-funder-current-v1.yaml')) throw new Error('Swagger UI 未配置随站发布的 OpenAPI 契约');
console.log(`静态站冒烟检查通过：${assets.length} 个资源，契约文件已包含`);

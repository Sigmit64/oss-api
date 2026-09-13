import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const dist = resolve(root, 'dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');

if (!html.includes('./assets/')) throw new Error('index.html 未使用可部署的相对资源路径');
for (const path of [
  'specs/oss-funder-current-v1.yaml',
  'specs/modules/module-registration.v1.schema.json',
  'specs/modules/module-invocation.v1.schema.json',
  'specs/modules/module-result.v1.schema.json',
]) {
  await access(resolve(dist, path));
}
const assets = await readdir(resolve(dist, 'assets'));
if (!assets.some((file) => file.endsWith('.js'))) throw new Error('构建结果缺少 JavaScript 资源');
if (!html.includes('CURRENT') || !html.includes('TARGET')) throw new Error('页面缺少 current/target 状态标签');
if (html.includes('https://github.com/')) throw new Error('页面仍包含未配置仓库地址的 GitHub 占位链接');
for (const [contract, status] of [
  ['module-invocation', 'current'],
  ['module-registration', 'target'],
  ['module-result', 'target'],
]) {
  const marker = `data-contract="${contract}" data-status="${status}"`;
  if (!html.includes(marker)) throw new Error(`契约状态标注错误或缺失：${contract}=${status}`);
}
console.log(`静态站冒烟检查通过：${assets.length} 个资源，契约文件已包含`);

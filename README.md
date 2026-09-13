# OSS-Funder API 文档站

这是一个独立的静态 Swagger UI 站点，用来发布 OSS-Funder 后端当前 HTTP API，以及已经冻结的模块 JSON Schema。页面内容和下载资源全部从本仓库构建，不依赖父项目目录。

## 本地开发

```bash
npm ci
npm run validate-specs
npm run build
npm run test:site
```

构建结果在 `dist/`。运行 `npx vite preview` 可以本地查看站点。

## 同步契约

源契约更新后，在本仓库执行：

```bash
npm run sync-specs -- --source /mnt/e/thu/4-1/backend/contracts
npm run validate-specs
```

同步会修正源 YAML 中两个紧凑 204 响应描述的逗号写法，使发布副本符合 OpenAPI 3.0 语法。发布构建只读取已提交的 `public/specs/`，不会访问父项目路径。

## GitHub Pages

`.github/workflows/pages.yml` 在 `main` 推送或手动触发时运行校验、构建并部署。工作流使用项目 Pages 兼容的相对资源路径，并只申请 `contents: read`、`pages: write`、`id-token: write` 权限。仓库设置中的 Pages Source 需要选择 **GitHub Actions**。

页面会明确区分：

- `CURRENT`：当前后端已经实现的 OpenAPI 接口。
- `module-invocation.v1.schema.json`：`CURRENT`，当前实现使用的模块调用输入契约。
- `module-registration.v1.schema.json`：`TARGET`，已冻结但选择器交叉规则仍待后端实现的模块注册契约。
- `module-result.v1.schema.json`：`TARGET`，已批准但当前后端尚未校验或解释的模块结果契约。

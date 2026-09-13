# OSS-Funder API 文档站实施计划

状态：用户已于 2026-09-13 批准。

## 目标

在独立的 `api` Git 仓库中提供可公开浏览的 OSS-Funder API 文档站，并通过 GitHub Actions 自动发布到 GitHub Pages。

## 实施范围

1. 使用 Swagger UI 展示当前已经实现的 HTTP OpenAPI 契约。
2. 在页面中明确标识“当前实现”，避免把规划中的接口描述成已上线能力。
3. 提供模块注册、调用和结果 JSON Schema 的直接查看或下载入口。
4. 将父项目中的已冻结契约复制到本仓库 `specs/`，使构建和发布不依赖父目录。
5. 提供可复现的 npm 构建、契约校验和静态页面测试命令。
6. 使用 GitHub 官方 Pages Actions，在 `main` 更新或手动触发时构建并部署站点。

## 目录约定

- `src/`：文档站页面和样式。
- `public/specs/`：随站点发布的 OpenAPI 与 JSON Schema。
- `scripts/`：契约同步或校验辅助脚本。
- `.github/workflows/`：验证及 Pages 发布工作流。

## 验收标准

- `npm ci` 和生产构建成功。
- OpenAPI YAML 与全部 JSON Schema 可以解析，内部引用有效。
- 页面可从项目型 Pages 子路径加载，刷新和静态资源路径正确。
- Swagger UI 正确展示当前接口，并可打开原始 OpenAPI 文件。
- 模块契约下载链接可访问。
- Pages workflow 使用最小权限：`contents: read`、`pages: write`、`id-token: write`。
- 不包含凭据、内部令牌或真实生产服务地址。

## 发布前置条件

- 用户提供或创建 GitHub 远端仓库，并授予推送及 Pages 管理权限。
- 仓库 Pages 的 Source 设为 GitHub Actions。
- 首次推送后确认 Actions 部署成功并记录公开 URL。

## 2026-09-13 展示层调整

用户要求移除宣传性和装饰性页面内容。站点应直接呈现接近原生的 Swagger UI，仅保留 HTTP API 的接口分组、参数、请求、响应和模型结构；不展示大幅标题、顶部导航、状态宣传卡片或页脚。OpenAPI 与模块 Schema 仍作为静态发布资源保留。

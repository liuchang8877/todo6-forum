# GitHub Discussions Community

一个无需后端和数据库的静态社区入口：

- GitHub Pages 托管页面和自有域名。
- GitHub Discussions 保存话题、回复、账号和审核记录。
- giscus 在首页嵌入一个固定的站务讨论。

## 1. Connect a Repository

准备一个公开 GitHub 仓库并启用 `Settings -> General -> Features -> Discussions`。

打开 [giscus 配置页](https://giscus.app/zh-CN)，选择该仓库和用于站务交流的 Discussions 分类，然后把生成配置中的以下四项填入 `config.js`：

```js
repository: "OWNER/REPOSITORY",
repositoryId: "R_...",
discussionCategory: "General",
discussionCategoryId: "DIC_...",
```

这些 ID 是公开标识，不是密钥。页面不需要、也不应保存 GitHub token。

`categories` 数组中的 `slug` 必须与 GitHub Discussions 分类 URL 最后一段一致，例如：

```text
https://github.com/OWNER/REPOSITORY/discussions/categories/q-a
```

对应 `slug: "q-a"`。

## 2. Publish with GitHub Pages

仓库已经包含 `.github/workflows/deploy-forum-pages.yml`。在 GitHub 仓库中打开：

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

推送到 `main` 后，工作流只会发布 `forum/` 目录，不会发布仓库根目录中的 CodeCharta 看板。

## 3. Use a Custom Domain

子域名最简单，例如 `forum.example.com`：

1. 将 `CNAME.example` 复制为 `CNAME`，并把内容改成真实域名。
2. 在域名服务商添加 `CNAME`：`forum` 指向 `<owner>.github.io`。
3. 在 GitHub `Settings -> Pages -> Custom domain` 填入相同域名并启用 HTTPS。
4. 在 GitHub 验证域名，避免仓库停用后发生域名接管。

根域名需要配置 `A`、`ALIAS` 或 `ANAME`。IP 可能变化，应以 [GitHub Pages 官方域名文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) 为准，不要从旧教程复制地址。

## Local Preview

```bash
python3 -m http.server 8099 --directory forum
```

打开 `http://127.0.0.1:8099/`。

## Boundary

GitHub Pages 不能运行 Discourse、Flarum、NodeBB 或 Apache Answer。这个方案适合接受 GitHub 登录的公开技术社区；它不提供独立账号体系，也不会把 Discussions 本身映射到自有域名。

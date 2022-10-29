# giscafer.com

我个人的 网站/博客。 技术栈 **Next.js/Typescript** & 部署在 **Vercel**。 博客数据来自 [issues 列表](https://github.com/giscafer/blog/issues)

博客原理：通过 ci 监听 issues 变更，自动更新 mdx 文件到项目 `data/blog/*.mdx` 文件夹中，Vercel 自动化构建更新。

- https://www.giscafer.com

## Features

- Github Issues 自动同步（见[实现文章介绍](https://mp.weixin.qq.com/s/sMNC20ei_J0XcVdJ0v3Fjw)）
- 使用[faunadb](https://fauna.com/)云端数据库存储
  <!-- - [Linear](https://linear.app/)  -->
  <!-- - [Webmention](https://webmention.io/) -->

## TODO

- [x] like post 功能
- [x] 文章浏览量统计
- [x] Tags 分类
- [ ] mdx 文件 自动获取 summary 字段展示
- [ ] 图片点击放大预览
- [ ] 优化同步脚步，只同步最近变更时间的 issues

## Usage

> 以下配置可以直接修改 `scripts/github/syncPost.js` 里边对应变量，就不需要配置了

- 本地运行博客时，测试博客文章同步脚本请修改`env` 环境变量 `GH_USER` 和 `GH_PROJECT_NAME`，保证 api 获取 issues 生成 mdx 文件
- GitHub Action Secret 配置 `GH_USER` 和 `GH_PROJECT_NAME`，保证 CI 执行正常，也可以直接修改

## 微信公众号

#### giscafer

<img src="./public/qrcode_for_giscafer.jpg" width="140"/>

#### 大前端洞见

<img src="./public/feinsight.jpg" width="450"/>

---

> [giscafer.com](http://giscafer.com) &nbsp;&middot;&nbsp;
> GitHub [@giscafer](https://github.com/giscafer) &nbsp;&middot;&nbsp;
> Weibo [@Nicky Lao](https://weibo.com/laohoubin)

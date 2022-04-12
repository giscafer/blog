# giscafer.com

我个人的 网站/博客。 技术栈 Next.js/Typescript & 部署在 Vercel。 博客数据来自 [issues 列表](https://github.com/giscafer/blog/issues)

博客原理：通过 ci 监听 issues 变更，自动更新 mdx 文件到项目 `data/blog/*.mdx` 文件夹中，Vercel 自动化构建更新。

- https://www.giscafer.com

## Features

- [Github Issues 自动同步博客文章](https://mp.weixin.qq.com/s/sMNC20ei_J0XcVdJ0v3Fjw)
- [faunadb 云端数据存储](https://fauna.com/)
- [Linear 监控](https://linear.app/)
- [Webmention](https://webmention.io/)

## TODO

- [x] like post 功能
- [x] 文章浏览量统计
- [ ] mdx 文件 自动获取 summary 字段展示
- [ ] 图片点击放大预览
- [ ] 优化同步脚步，只同步最近变更时间的 issues

## 微信公众号

#### giscafer

<img src="./public/qrcode_for_giscafer.jpg" width="140"/>

#### 大前端洞见

<img src="./public/feinsight.jpg" width="450"/>

---

> [giscafer.com](http://giscafer.com) &nbsp;&middot;&nbsp;
> GitHub [@giscafer](https://github.com/giscafer) &nbsp;&middot;&nbsp;
> Weibo [@Nickbing Lao](https://weibo.com/laohoubin)

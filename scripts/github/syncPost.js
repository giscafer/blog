/* eslint-disable */
const GitHub = require('github-api')
const fs = require('fs-extra')
const path = require('path')
const pinyin = require('pinyin')
const _ = require('lodash')

const gh = new GitHub({
  token: process.env.GH_TOKEN,
})

const blogOutputPath = '../../data/blog'

// get blog list
const issueInstance = gh.getIssues('giscafer', 'blog')

function generateMdx(issue) {
  const { title, labels, created_at, body, html_url } = issue
  // todo: summary
  return `---
  title: ${title.trim()}
  publishedAt: ${created_at}
  summary: ${'查看全文>>'}
  tags: ${JSON.stringify(labels.map(item => item.name))}
---

${body.replace(/<br \/>/g, '\n')}

---
欢迎前往原文讨论：[${html_url}](${html_url})
`
}

function main() {
  const filePath = path.resolve(__dirname, blogOutputPath)
  // 只查询自己的issues，避免别人创建的也更新到博客
  issueInstance.listIssues({ creator: 'giscafer' }).then(({ data }) => {
    let successCount = 0
    fs.ensureDirSync(filePath)
    fs.emptyDirSync(filePath)
    for (const item of data) {
      try {
        const content = generateMdx(item)
        /* const tempFileName = item.title?.trim().replace(/\//g, '&').replace(/、/g, '-').replace(/ - /g, '-').replace(/\s/g, '-')
        const result = pinyin(tempFileName, {
          style: 0,
        })
        const fileName = _.flatten(result).join('') */
        // 文件名换成issue number
        const fileName = `post-${item.number}`
        fs.writeFileSync(`${filePath}/${fileName}.mdx`, content)
        console.log(`${filePath}/${fileName}.mdx`, 'success')
        successCount++
      } catch (error) {
        console.log(error)
      }
    }
    if (successCount === data.length) {
      console.log('文章全部同步成功！', data.length)
    } else {
      console.log('文章同步失败！失败数量=', data.length - successCount)
    }
  })
}

module.exports = main

/* eslint-disable */
const GitHub = require('github-api')
const fs = require('fs-extra')
const dayjs = require('dayjs')
const path = require('path')
const pinyin = require('pinyin')
const _ = require('lodash')

const gh = new GitHub({
  token: process.env.GH_TOKEN,
})

const blogOutputPath = '../../../data/blog'
const contentLayerPostPath = '../../../.contentlayer/data/Post'

// get blog list
const issueInstance = gh.getIssues('giscafer', 'blog')

function generateMdx(issue) {
  const { title, labels, created_at, body } = issue
  console.log('====================================')
  console.log(
    JSON.stringify(
      labels.map(item => item.name),
      null,
      2,
    ),
  )
  console.log('====================================')
  return `---
  title: ${title}
  publishedAt: ${dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}
  summary: ${title}
  tags: ${JSON.stringify(labels.map(item => item.name))}
---

${body.replace(/<br \/>/g, '\n')}
`
}

function main() {
  const filePath = path.resolve(__dirname, blogOutputPath)
  fs.ensureDirSync(filePath)
  fs.emptyDirSync(filePath)
  fs.emptyDirSync(path.resolve(__dirname, contentLayerPostPath))

  issueInstance.listIssues().then(({ data }) => {
    let successCount = 0
    for (const item of data) {
      try {
        // const dateStr = dayjs(item.created_at).format('YYYY-MM-DD')
        const content = generateMdx(item)
        const tempFileName = item.title.replace(/\//g, '&').replace(/、/g, '-').replace(/ - /g, '-')
        const result = pinyin(tempFileName, {
          style: 0,
        })
        const fileName = _.flatten(result).join('')
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

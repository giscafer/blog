import { defineDocumentType, makeSource, ComputedFields } from 'contentlayer/source-files' // eslint-disable-line
import readingTime from 'reading-time'
import rehypePrism from 'rehype-prism-plus'
import codeTitle from 'remark-code-titles'

const imgReg = new RegExp(/https:\/\/(.*)\.(png|jpeg|gif|svg|jpg)/)

const getCoverImg = doc => {
  const { raw } = doc.body

  const match = raw.match(imgReg)
  if (match) {
    return match[0]
  }
  return '/blog/default/image.png'
}

const getSlug = doc => {
  const name = doc._raw.sourceFileName.replace(/\.mdx$/, '')
  return name
}

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: doc => getSlug(doc),
  },
  image: {
    type: 'string',
    resolve: doc => getCoverImg(doc),
    // resolve: doc => `/blog/${getSlug(doc)}/image.png`,
  },
  og: {
    type: 'string',
    resolve: doc => `/blog/${getSlug(doc)}/og.png`,
  },
  readingTime: { type: 'json', resolve: doc => readingTime(doc.body.raw) },
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    publishedAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: false },
    tags: { type: 'json', required: false },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data/blog',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [rehypePrism],
    remarkPlugins: [codeTitle],
  },
})

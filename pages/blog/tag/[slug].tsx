import { GetStaticProps, GetStaticPaths } from 'next'
// import slugify from 'slugify'
import { useRouter } from 'next/router'

// Components
import Page from 'components/page'
import PageHeader from 'components/pageheader'
import PostList from 'components/postlist'

// Utils
import { pick } from '@contentlayer/client'
import { allPosts } from '.contentlayer/data'

// Types
import type { Post } from '.contentlayer/types'

type TagProps = {
  posts: Post[]
}

const Tag = ({ posts }: TagProps): JSX.Element => {
  const { query } = useRouter()
  const { slug } = query as { slug: string }

  const FormattedSlug = () => <span style={{ textTransform: 'capitalize' }}>{slug?.replace('-', ' ')}</span>

  return (
    <Page>
      <PageHeader
        title={<FormattedSlug />}
        description={
          <>
            关于 「<FormattedSlug />」 的文章和教程
          </>
        }
      />
      <PostList posts={posts} />
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = allPosts
    .map(p => p.tags)
    .flat()
    .filter(Boolean)
    .map(tag => ({ params: { slug: tag } }))
  // slugify 不支持中文
  // .map(tag => ({ params: { slug: slugify(tag, { lower: true }) || '404' } }))
  return {
    paths: tags,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async context => {
  const posts = allPosts
    // slugify 不支持中文
    // .filter(post => post.tags?.some(x => slugify(x, { lower: true }) === context.params.slug))
    .filter(post => post.tags?.some(x => x === context.params.slug))
    .filter(Boolean)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map(post => pick(post, ['slug', 'title', 'summary', 'publishedAt', 'image', 'readingTime']))
  return { props: { posts } }
}

export default Tag

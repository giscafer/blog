import { GetStaticPaths, GetStaticProps } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks' // eslint-disable-line
import { NextSeo } from 'next-seo'
import { useTheme } from 'next-themes'
import Head from 'next/head'
import Link from 'next/link'
import { pick } from '@contentlayer/client'

// Components
import HitCounter from 'components/hitcounter'
import CustomImage from 'components/image'
// import LikeButton from 'components/likebutton'
import Page from 'components/page'
import PageHeader from 'components/pageheader'
import Warning from 'components/warning'
// import { NowPlayingIcon } from 'components/nowplaying'
// import Subscribe from 'components/subscribe'
import Giscus from '@giscus/react'
import AnimatedMessages from 'components/animatedmessages'
import { RatingPlayground } from 'components/blog/rating'
import Button from 'components/button'
import Messages, { TailBreakdown } from 'components/messages'
import Parallax from 'components/parallax'
import PostList from 'components/postlist'
import SegmentedControl from 'components/segmentedcontrol'
import Tags from 'components/tags'

// Utils
import { allPosts } from '.contentlayer/data'
import type { Post as PostType } from '.contentlayer/types'

import styles from './post.module.scss'

const CustomLink = (props: { href: string }) => {
  const { href } = props

  /* eslint-disable */
  if (href?.startsWith('/')) {
    return (
      <Link href={href}>
        <a {...props} />
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
  /* eslint-enable */
}

const components = {
  Head,
  a: CustomLink,
  Image: CustomImage,
  img: CustomImage,
  Warning,
  Link: CustomLink,
  // NowPlayingIcon,
  SegmentedControl,
  Messages,
  AnimatedMessages,
  TailBreakdown,
  Parallax,
  Rating: RatingPlayground,
}

type PostProps = {
  post: PostType
  related: PostType[]
  githubUser?: string
  githubProject?: string
}

const Post = ({ post, related, githubUser, githubProject }: PostProps): JSX.Element => {
  const Component = useMDXComponent(post.body.code)
  const { theme } = useTheme()
  const formattedPublishDate = new Date(post.publishedAt).toLocaleString('zh-CN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
  const formattedUpdatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleString('zh-CN', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : null

  const seoTitle = `${post.title} | Nicky Lao`
  const seoDesc = `${post.summary}`
  const url = `https://giscafer.com/blog/${post.slug}`

  return (
    <Page>
      <NextSeo
        title={seoTitle}
        description={seoDesc}
        canonical={url}
        openGraph={{
          title: seoTitle,
          url,
          description: seoDesc,
          images: [
            {
              url: post.og
                ? `https://giscafer.com${post.og}`
                : `https://og-image.giscafer.vercel.app/${encodeURIComponent(post.title)}?desc=${encodeURIComponent(
                    seoDesc,
                  )}&theme=dark.png`,
              alt: post.title,
            },
          ],
          site_name: 'giscafer | Nicky Lao',
          type: 'article',
          article: {
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            authors: ['https://giscafer.com'],
          },
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      {/*   {post.slug === 'post-22' ? (
        <ParallaxCover />
      ) : (
        <>{post.image && <BlogImage src={post.image} alt={post.title} className={styles.image} />}</>
      )} */}
      <PageHeader title={post.title} compact>
        <p className={styles.meta}>
          发布于 <time dateTime={post.publishedAt}>{formattedPublishDate}</time>
          {post.updatedAt ? ` (Updated ${formattedUpdatedDate})` : ''} <span>&middot;</span> 预估阅读{' '}
          {Math.ceil(post.readingTime?.minutes * 3)} 分钟
          <HitCounter slug={post.slug} />
        </p>
      </PageHeader>
      <article className={styles.article}>
        <Component components={components} />
      </article>
      {/* <div className={styles.buttons}>
        <LikeButton slug={post.slug} />
      </div> */}
      <Tags tags={post.tags} />
      {/* <Subscribe className={styles.subscribe} /> */}
      {related.length > 0 && (
        <>
          <h2 className={styles.relatedHeading}>相关文章</h2>
          <PostList posts={related} hideImage />
        </>
      )}
      <div className={styles.buttons}>
        <Button href="/blog">返回博客列表</Button>
      </div>
      <Giscus
        id="comments"
        repo={`${githubUser}/${githubProject}`}
        repoId="MDEwOlJlcG9zaXRvcnk2MjYyOTkxOQ=="
        category="General"
        categoryId="DIC_kwDOA7uoH84CV9v8"
        mapping="specific"
        term={seoTitle}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'system' ? 'preferred_color_scheme' : theme}
        lang="zh-CN"
        loading="lazy"
      />
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allPosts.map(p => ({ params: { slug: p.slug || '404' } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { GH_USER = 'giscafer', GH_PROJECT_NAME = 'blog' } = process.env
  const post = allPosts.find(p => p.slug === params?.slug)
  const related = allPosts
    /* remove current post */
    .filter(p => p.slug !== params?.slug)
    /* Find other posts where tags are matching */
    .filter(p => p.tags?.some(tag => post.tags?.includes(tag)))
    /* return the first three */
    .filter((_, i) => i < 3)
    /* only return what's needed to render the list */
    .map(p => pick(p, ['slug', 'title', 'summary', 'publishedAt', 'image', 'readingTime']))

  return {
    props: {
      post,
      related,
      githubUser: GH_USER,
      githubProject: GH_PROJECT_NAME,
    },
  }
}

export default Post

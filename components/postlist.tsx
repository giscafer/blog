import Link from 'next/link'

// Components
import BlogImage from 'components/blogimage'
import ParallaxCover from 'components/blog/parallaxcover'

// Utils
import { formatDate } from 'lib/formatdate'
import type { Post } from '.contentlayer/types'

import styles from './postlist.module.scss'

type PostListProps = {
  posts: Post[]
  hideImage?: boolean
}

const PostList = ({ posts, hideImage = false }: PostListProps): JSX.Element => (
  <ul className={styles.list}>
    {posts.length === 0 && <p className={styles.noResults}>🧐 No posts found</p>}
    {posts.map(post => {
      const { summary, title, readingTime: readTime, publishedAt, image, slug } = post
      return (
        <li key={slug}>
          {!hideImage &&
            (slug === 'post-22' ? (
              <Link href="/blog/post-22">
                <a>
                  <ParallaxCover />
                </a>
              </Link>
            ) : (
              <>
                {image && (
                  <Link as={`/blog/${slug}`} href="/blog/[slug]">
                    <a aria-label={title}>
                      <BlogImage src={image} alt={title} />
                    </a>
                  </Link>
                )}
              </>
            ))}
          <Link as={`/blog/${slug}`} href="/blog/[slug]">
            <a className={styles.title}>{title}</a>
          </Link>
          {/* TODO: mdx没有summary时智能提取？ */}
          {summary !== '查看全文>>' && <p className={styles.summary}>{summary}</p>}

          <p className={styles.meta}>
            发布于 <time dateTime={publishedAt}>{formatDate(publishedAt)}</time> &middot; 预估阅读 {Math.ceil(readTime.minutes * 1.5)} 分钟
          </p>
        </li>
      )
    })}
  </ul>
)

export default PostList

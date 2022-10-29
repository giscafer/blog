import { pick } from '@contentlayer/client'
// import Subscribe from 'components/subscribe'
import Input from 'components/input'
// Components
import Page from 'components/page'
import PageHeader from 'components/pageheader'
import PostList from 'components/postlist'
import { Section } from 'components/section'
import Badge from 'components/badge'
// Utils
import * as gtag from 'lib/gtag'
import debounce from 'lodash.debounce'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { useCallback, useState } from 'react'
import { Search } from 'react-feather'
import PostListSwitch from 'components/postswitch'
import type { Post } from '.contentlayer/types'
import { allPosts } from '.contentlayer/data'
import styles from './index.module.scss'

type BlogProps = {
  posts: Post[]
  tagList: string[]
}

const Blog = ({ posts, tagList }: BlogProps): JSX.Element => {
  const [currentSearch, setCurrentSearch] = useState('')
  const [hideCoverMode, setHideCoverMode] = useState(false)
  const trackSearch = useCallback(
    debounce((value: string) => gtag.search(value), 500),
    [],
  )
  const seoTitle = 'Blog | Nicky Lao'
  const seoDesc = '关于大前端的技术文章，包含且不限于 React、Angular、React Native 等。'
  const filteredPosts = posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .filter(({ title, summary, tags }) => {
      const searchString = `${title.toLowerCase()} ${summary.toLowerCase()} ${tags?.join(' ')}`
      return searchString.includes(currentSearch.toLowerCase())
    })

  const handleInputChange = e => {
    const searchString = e.target.value
    if (searchString !== '') {
      trackSearch(searchString) // Save what people are interested in reading
    }
    return setCurrentSearch(searchString)
  }

  return (
    <Page>
      <NextSeo
        title={seoTitle}
        description={seoDesc}
        openGraph={{
          title: seoTitle,
          url: `https://giscafer.com/blog/`,
          description: seoDesc,
          site_name: 'giscafer | Nicky Lao',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <PageHeader title="Blog" description={seoDesc}>
        <Section>
          <div className={styles.inputWrapper}>
            <Input className={styles.input} value={currentSearch} onChange={handleInputChange} placeholder="搜索文章…" type="search" />
            <Search className={styles.inputIcon} />
          </div>
          <div className={styles.tagWrapper}>
            <Section.Title>Tags</Section.Title>
            <Section.Content>
              <div className={styles.tagList}>
                {tagList.map(tag => (
                  <Link href={`/blog/tag/${tag}`}>
                    <Badge key={tag} className="cursor-pointer">
                      #{tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </Section.Content>
          </div>
        </Section>
      </PageHeader>
      <PostListSwitch
        checked={hideCoverMode}
        onChange={v => {
          setHideCoverMode(v)
        }}
      />
      <PostList posts={filteredPosts} hideImage={!hideCoverMode} />
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = allPosts.map(post => pick(post, ['slug', 'title', 'summary', 'publishedAt', 'image', 'readingTime']))
  const tags = new Set(allPosts.reduce((acc, cur) => acc.concat(cur.tags), []))
  const tagList: string[] = [...tags]
  return {
    props: { posts, tagList },
  }
}

export default Blog

import Page from 'components/page'
import PageHeader from 'components/pageheader'
import Subscribe from 'components/subscribe'
import { NextSeo } from 'next-seo'

import styles from './newsletter.module.scss'

const NewsletterPage = (): JSX.Element => {
  const seoTitle = 'Newsletter | Nickbing Lao'
  const seoDesc = ' 关于设计 &amp; 开发领域。学习大前端、Web 开发技巧 &amp; 窍门，并创作令人愉快和有用的作品！'

  return (
    <Page>
      <NextSeo
        title={seoTitle}
        description={seoDesc}
        openGraph={{
          title: seoTitle,
          url: `https://giscafer.com/newsletter/`,
          description: seoDesc,
          site_name: 'Giscafer.com',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <PageHeader
        title="邮箱订阅"
        description={
          <>
            <p>
              关于 <em className={styles.em}>设计 &amp; 开发</em> 领域。学习大前端、Web 开发技巧 &amp; 窍门，并创作令人愉快和有用的作品！
            </p>
            <p>没有垃圾邮件，随时退订！</p>
          </>
        }
        compact
      />
      <Subscribe header={false} />
    </Page>
  )
}

export default NewsletterPage

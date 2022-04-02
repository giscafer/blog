import Image from 'next/image'
import Page from 'components/page'
import Button from 'components/button'
import { NextSeo } from 'next-seo'
import me from 'public/nicky.png'
import styles from './about.module.scss'

const About = (): JSX.Element => {
  const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
  }
  const seoTitle = 'About Nickbing Lao'
  return (
    <Page>
      <NextSeo
        title={seoTitle}
        openGraph={{
          title: seoTitle,
          url: `https://giscafer.com/about/`,
          site_name: 'Nickbing Lao',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <Image src={me} alt="Picture of me (Nickbing Lao)" placeholder="blur" className={styles.image} priority />
      <div className={styles.text}>
        <p>Hey I’m Nicky, a fullstack developer currently living in 🇨🇳 Guangzhou, China.</p>

        <p>
          自驱型前端工程师，8年多大型复杂产品开发经验，4年前端团队管理经验，熟悉跨端APP 如 Ionic、React Native开发，熟悉 微前端、DevOps
          等，具备全栈开发能力。✨.
        </p>
        <p>
          对我感兴趣 (可查看{' '}
          <a href="https://visiky.github.io/resume/?lang=zh_CN&user=giscafer" {...linkProps}>
            在线简历
          </a>{' '}
          ).
        </p>
        <p>
          <ul>
            <li>
              <a href="https://github.com/giscafer" {...linkProps}>
                Github
              </a>
            </li>
            <li>
              <a href="https://www.zhihu.com/people/giscafer/" {...linkProps}>
                知乎
              </a>
            </li>
          </ul>
        </p>
      </div>
      <Button href="mailto:giscafer@outlook.com">联系我</Button>
    </Page>
  )
}

export default About

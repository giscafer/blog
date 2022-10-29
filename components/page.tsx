import { ReactNode } from 'react'
import Header from 'components/header'
import Link from 'next/link'
import PageTransition from 'components/pagetransition'
import styles from './page.module.scss'

type PageProps = {
  children: ReactNode
}

const footerLinks = [
  { name: 'Home', url: '/' },
  { name: 'GitHub', url: 'https://github.com/giscafer', target: '_blank' },
  { name: '旅游地图', url: 'http://map.giscafer.com', target: '_blank' },

  { name: 'Blog', url: '/blog' },
  { name: '语雀', url: 'https://www.yuque.com/giscafer', target: '_blank' },
  { name: '知乎', url: 'https://www.zhihu.com/people/giscafer', target: '_blank' },
  { name: 'About', url: '/about' },
  { name: '微博', url: 'https://weibo.com/laohoubin', target: '_blank' },
  { name: 'RSS', url: '/feed.xml', target: '_blank' },
]

const Page = ({ children }: PageProps): JSX.Element => (
  <div className={styles.container}>
    <Header />
    <main className={styles.main}>
      <PageTransition>{children}</PageTransition>
    </main>
    <footer className={styles.footer}>
      <ul className={styles.links}>
        {footerLinks.map(link => {
          if (link.target === '_blank') {
            return (
              <li key={link.name}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            )
          }
          return (
            <li key={link.name}>
              <Link href={link.url}>
                <a>{link.name}</a>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className={styles.bottomInfo}>
        <p className={styles.copyright}>&copy; Nicky Lao {new Date().getFullYear()}</p>
        <img src="https://visitor-badge.glitch.me/badge?page_id=giscafer.com" alt="访问人数" />
      </div>
    </footer>
  </div>
)

export default Page

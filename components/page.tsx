import { ReactNode } from 'react'
import Header from 'components/header'
// import NowPlaying from 'components/nowplaying'
import Link from 'next/link'
import PageTransition from 'components/pagetransition'
import styles from './page.module.scss'

type PageProps = {
  children: ReactNode
}

const footerLinks = [
  { name: 'Home', url: '/' },
  { name: 'GitHub', url: 'https://github.com/giscafer' },
  { name: 'RSS', url: '/feed.xml' },
  { name: 'Blog', url: '/blog' },
  { name: 'Zhihu', url: 'https://www.zhihu.com/people/giscafer' },
  { name: 'Travel Map', url: 'http://map.giscafer.com', target: '_blank' },
  { name: 'About', url: '/about' },
  { name: 'WeiBo', url: 'https://weibo.com/laohoubin' },
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
      {/* <NowPlaying /> */}
      <p className={styles.copyright}>&copy; Nickbing Lao {new Date().getFullYear()}</p>
    </footer>
  </div>
)

export default Page

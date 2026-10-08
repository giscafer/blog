import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Page from 'components/page'
import avatar from 'public/avatar.png'
import styles from './about.module.scss'

const skills = ['React / Vue / Angular', '小程序 & Native', 'Electron & Ionic', 'Node.js & DevOps', 'AI Agent 开发']

const nav = [
  { id: 'about', label: '关于我', href: '#about' },
  { id: 'work', label: '项目', href: '/' },
  { id: 'contact', label: '联系', href: '#contact' },
]

type Section = 'hero' | 'about' | 'contact'

const About = (): JSX.Element => {
  const [section, setSection] = useState<Section>('hero')
  const [step, setStep] = useState(0)
  const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  useEffect(() => {
    const previous = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#f5efe6'
    const onScroll = () => {
      const about = document.getElementById('about')
      const contact = document.getElementById('contact')
      const contactTop = contact?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      const aboutTop = about?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      if (contactTop < window.innerHeight * 0.42) setSection('contact')
      else if (aboutTop < window.innerHeight * 0.55) setSection('about')
      else setSection('hero')

      if (!about) return
      const scrollable = about.offsetHeight - window.innerHeight
      const seen = Math.min(Math.max(-about.getBoundingClientRect().top, 0), Math.max(scrollable, 0))
      const next = scrollable > 0 ? seen / scrollable : 1
      if (next < 0.12) setStep(0)
      else if (next < 0.34) setStep(1)
      else if (next < 0.58) setStep(2)
      else setStep(3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.body.style.backgroundColor = previous
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const activeIndex = { hero: -1, about: 0, contact: 2 }[section]
  const seoTitle = 'About Nicky Lao'

  return (
    <Page bare>
      <NextSeo
        title={seoTitle}
        openGraph={{
          title: seoTitle,
          url: 'https://giscafer.com/about/',
          site_name: 'Giscafer.com',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <div className={styles.page}>
        <Link href="/">
          <a className={styles.brand} aria-label="回到首页">
            <Image src={avatar} alt="" width={42} height={42} priority />
          </a>
        </Link>
        <Link href="/blog">
          <a className={styles.blogLink}>博客</a>
        </Link>

        <nav className={section === 'hero' ? styles.nav : styles.navDark} aria-label="关于页导航">
          <span
            className={activeIndex >= 0 ? styles.navBarOn : styles.navBar}
            style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
          />
          {nav.map(item => {
            const active = (item.id === 'about' && section === 'about') || (item.id === 'contact' && section === 'contact')
            if (item.href.startsWith('/')) {
              return (
                <Link key={item.id} href={item.href}>
                  <a className={styles.navLink}>{item.label}</a>
                </Link>
              )
            }
            return (
              <a key={item.id} href={item.href} className={active ? styles.navLinkActive : styles.navLink}>
                {item.label}
              </a>
            )
          })}
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              你好，我是
              <br />
              Nicky
              <span className={styles.badge}>全栈工程师</span>
            </h1>
          </div>
          <div className={section === 'hero' ? styles.scrollHint : styles.scrollHintHidden} aria-hidden="true">
            <span className={styles.mouse}>
              <span className={styles.mouseDot} />
            </span>
            <span className={styles.chevron} />
          </div>
        </section>

        <section className={styles.stage} id="about" data-step={step}>
          <div className={styles.stageSticky}>
            <div className={styles.portrait}>
              <Image src="/nicky.jpeg" alt="Nicky Lao" layout="fill" objectFit="cover" objectPosition="62% 42%" priority />
            </div>

            <article className={`${styles.card} ${styles.nameCard}`}>
              <div className={styles.cardBody}>
                <h2>Nicky Lao</h2>
                <p className={styles.location}>
                  <span className={styles.pin} aria-hidden="true" />
                  广州
                </p>
              </div>
            </article>

            <article className={`${styles.card} ${styles.bioCard}`}>
              <div className={styles.cardBody}>
                <p>Hey I’m Nicky Lao, a fullstack developer currently living in Guangzhou, China.</p>
                <p>
                  资深前端工程师，具备全栈开发能力，12年+大型复杂产品开发经验，5年大前端团队管理经验。熟悉 React / Vue / Angular /
                  小程序，以及 Native、Electron、Ionic，也熟悉 Node.js 和 DevOps。
                </p>
                <p>目前做全栈和 Agent 开发，最近在探索 AI、本体如何赋能开发和业务。欢迎交流。</p>
              </div>
            </article>

            <article className={`${styles.card} ${styles.skillsCard}`}>
              <div className={styles.cardBody}>
                <h2>技能</h2>
                <ul>
                  {skills.map(skill => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.contact} id="contact">
          <h2>
            一起
            <br />
            做点有趣的事
          </h2>
          <p className={styles.contactLead}>AI Vibe Coding 出来之前，这些方向的代码就是手撸的。现在继续用 Agent 把想法做成东西。</p>
          <ul className={styles.socials}>
            <li>
              <a href="https://github.com/giscafer/" {...linkProps}>
                Github
              </a>
            </li>
            <li>
              <a href="https://www.zhihu.com/people/giscafer/" {...linkProps}>
                知乎
              </a>
            </li>
            <li>
              <a href="https://www.x.com/nicky_lao" {...linkProps}>
                X
              </a>
            </li>
          </ul>
          <a className={styles.mail} href="mailto:giscafer@outlook.com">
            联系我
          </a>
        </section>
      </div>
    </Page>
  )
}

export default About

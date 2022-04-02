import { useRef, useState } from 'react'
import { Send, CheckCircle } from 'react-feather'
import cn from 'classnames'
import { useRouter, NextRouter } from 'next/router'

import Button from 'components/button'

import styles from './subscribe.module.scss'

type SubscribeProps = { title?: string; header?: boolean; className?: string }

const Subscribe = ({ title, header = true, className }: SubscribeProps) => {
  const { query } = useRouter() as NextRouter
  const inputEl = useRef(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const subscribe = async e => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: inputEl.current.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()

    if (error) {
      setLoading(false)
      setMessage(error)
      return
    }

    inputEl.current.value = ''
    setLoading(false)
    setMessage('感谢，请检查你的邮箱并确认邮件！ ✨')
  }

  const wrapperClassName = cn(styles.wrapper, className)
  if (query.confirmed) {
    return (
      <div className={wrapperClassName}>
        <header className={styles.header}>
          <CheckCircle style={{ color: 'green' }} />
          <h4 className={styles.title}>感谢您确认邮件!</h4>
        </header>
        <p className={styles.description} style={{ marginBottom: 0 }}>
          你在名单上，在新的内容发布时会受到通知。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={subscribe} className={wrapperClassName}>
      {header && (
        <>
          <header className={styles.header}>
            <Send />
            <p className={styles.title}>{title || '对文章感兴趣? 可以输入邮箱订阅!'}</p>
          </header>
          <p className={styles.description}>
            关于 <em className={styles.em}>设计 &amp; 开发</em> 领域。学习大前端、Web 开发技巧和窍门，&amp; 并创建令人愉快和有用的界面！
          </p>
          <p className={styles.description}>没有垃圾邮件，随时退订！</p>
        </>
      )}
      <label htmlFor="email-input" className="sr-only">
        邮箱地址
      </label>
      <div className={cn(styles.inputWrapper, message && styles.hidden)}>
        <input className={styles.input} id="email-input" name="email" placeholder="输入邮箱地址" ref={inputEl} required type="email" />
        <Button disabled={loading} type="submit">
          订阅
        </Button>
        {message && <div className={styles.message}>{message}</div>}
      </div>
    </form>
  )
}

export default Subscribe

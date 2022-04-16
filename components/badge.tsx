import classNames from 'classnames'
import { FC, ReactNode } from 'react'
import styles from './badge.module.scss'

type Props = {
  className?: string
  onClick?: () => void
  children: ReactNode
}

const Badge: FC<Props> = ({ className, children, onClick, ...otherProps }: Props) => {
  return (
    <span className={classNames(styles.tag, className)} onClick={onClick} {...otherProps} aria-hidden="true">
      {children}
    </span>
  )
}

export default Badge

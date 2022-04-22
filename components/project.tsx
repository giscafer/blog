import { Link2, GitHub } from 'react-feather'
import cn from 'classnames'
import Image from 'next/image'
import styles from './project.module.scss'

type ProjectProps = {
  title: string
  description: string
  link: string
  github?: string
  linkText?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any
  small?: boolean
  priority?: boolean
}

const Project = ({ title, description, link, image, linkText, small, priority, github }: ProjectProps): JSX.Element => {
  return (
    <div className={styles.project}>
      <a href={`https://${link}`} target="_blank" rel="noreferrer" aria-label={title}>
        <div className={cn(styles.background, small && styles.backgroundSmall)}>
          {image && (
            <div className={styles.imageWrapper}>
              <div className={styles.image}>
                <Image src={image} priority={priority} layout="responsive" sizes="(max-width: 700px) 90vw, 700px" />
              </div>
            </div>
          )}
        </div>
      </a>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.links}>
        {link && (
          <a href={`https://${link}`} className={styles.link} target="_blank" rel="noreferrer">
            {linkText || `访问 ${link}`}
            <Link2 />
          </a>
        )}
        {github && (
          <>
            <span className={styles.dividerDot}>·</span>
            <a href={`https://${github}`} className={styles.link} target="_blank" rel="noreferrer">
              源码
              <GitHub />
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export default Project

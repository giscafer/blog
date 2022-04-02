import Parallax from 'components/parallax'
import Image from 'next/image'
import styles from './parallaxcover.module.scss'

const ParallaxCover = (): JSX.Element => (
  <div className={styles.wrapper}>
    <div className={styles.parallaxContainer}>
      <Parallax offset={100} clampInitial>
        <Image src="/blog/awesome/og.png" width="2024" height="1272" sizes="(min-width: 480px) 780px, 100vw" />
      </Parallax>
    </div>
    {/*  <div className={styles.logo}>
      <Image src="/blog/awesome/logo.png" width="324" height="324" alt="default logo" sizes="(min-width: 540px) 120px, 50px" />
    </div> */}
  </div>
)

export default ParallaxCover

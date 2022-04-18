import Switch from 'rc-switch'
import { FC } from 'react'
import styles from './postswitch.module.scss'

type PostListSwitchProps = {
  checked: boolean
  // eslint-disable-next-line no-unused-vars
  onChange: (v: boolean) => void
}

const PostListSwitch: FC<PostListSwitchProps> = ({ checked = false, onChange }: PostListSwitchProps) => {
  return (
    <div className={styles.postSwitch}>
      <Switch checked={checked} onChange={v => onChange(v)} checkedChildren="显示封面" unCheckedChildren="隐藏封面" />
    </div>
  )
}

export default PostListSwitch

import { ReactNode, FC } from 'react'

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface TitleProps {
  as?: Heading
  action?: ReactNode
}

type PageProps = {
  children: ReactNode
}

const Title: FC<TitleProps> = ({ as: TitleComponent = 'h1', action, children }: TitleProps & PageProps) => {
  return (
    <header className="flex flex-row justify-between items-center mt-12">
      <TitleComponent className="text-5xl font-extrabold leading-tight">{children}</TitleComponent>
      {action}
    </header>
  )
}

const Content: FC = ({ children }: PageProps) => {
  return <div className="mt-3 space-y-4">{children}</div>
}

const SectionRoot: FC = ({ children }: PageProps) => {
  return <section>{children}</section>
}

export const Section = Object.assign(SectionRoot, { Title, Content })

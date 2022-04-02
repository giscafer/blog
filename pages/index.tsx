import Button from 'components/button'
import PageHeader from 'components/pageheader'
import Project from 'components/project'
import Page from 'components/page'
import { startJob } from 'lib/job'

import codegen from 'public/projects/vscode-codegen.png'
import roothub from 'public/projects/roothub.png'
import leekfund from 'public/projects/leekfund.png'

const projects = [
  {
    title: 'RootHub 前端物料平台',
    description: '物料资产统一管理平台，致力于前端效能提升探索',
    link: 'roothub.leekhub.com',
    image: roothub,
    github: 'github.com/RootLinkFE/roothub',
  },
  {
    title: 'CodeGen',
    description: 'RootHub 前端研发平台 VSCode插件',
    link: 'marketplace.visualstudio.com/items?itemName=giscafer.roothub',
    image: codegen,
  },
  {
    title: 'VSCode 插件-韭菜盒子',
    description: '韭菜盒子——VSCode 里也可以看股票 & 基金 & 期货实时数据，做最好用的投资插件',
    link: 'github.com/LeekHub/leek-fund',
    github: 'github.com/LeekHub/leek-fund',
    image: leekfund,
  },
]

export async function getStaticProps() {
  // https://github.com/vercel/next.js/discussions/12124
  startJob()
  return {
    props: {
      allPostsData: [],
    },
  }
}

const Home = (): JSX.Element => (
  <Page>
    <PageHeader title="你好，我叫 giscafer ！" description="我是一名前端开发工程师, 这是我的个人网站">
      <Button href="/about">了解更多</Button>
    </PageHeader>
    <h2>个人项目</h2>
    {projects.map(project => (
      <Project key={project.title} {...project} />
    ))}
  </Page>
)

export default Home

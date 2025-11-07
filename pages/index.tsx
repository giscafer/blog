import Button from 'components/button'
import PageHeader from 'components/pageheader'
import Project from 'components/project'
import Page from 'components/page'

import codegenImg from 'public/projects/vscode-codegen.png'
import roothubImg from 'public/projects/roothub.png'
import leekFundImg from 'public/projects/leekfund.png'
import frontendBox from 'public/projects/frontend-box.png'

const projects = [
  {
    title: 'RootHub 前端物料平台',
    description: '物料资产统一管理平台，致力于前端效能提升探索',
    link: 'roothub.leekhub.com',
    image: roothubImg,
    github: 'github.com/RootLinkFE/roothub',
  },
  {
    title: 'CodeGen',
    description: 'RootHub 前端研发平台 VSCode插件',
    linkText: 'giscafer.roothub',
    link: 'marketplace.visualstudio.com/items?itemName=giscafer.roothub',
    image: codegenImg,
  },
  {
    title: '前端盒子',
    description: 'VSCode 里订阅查看前端技术文章',
    linkText: 'giscafer.frontend-box',
    link: 'marketplace.visualstudio.com/items?itemName=giscafer.frontend-box',
    github: 'github.com/giscafer/vscode-frontend-box',
    image: frontendBox,
  },
  {
    title: '韭菜盒子',
    description: '韭菜盒子——VSCode 里也可以看股票 & 基金 & 期货实时数据，做最好用的投资插件（23k+下载量）',
    link: 'leek.fund',
    github: 'github.com/LeekHub/leek-fund',
    image: leekFundImg,
  },
]

export async function getStaticProps() {
  // https://github.com/vercel/next.js/discussions/12124
  return {
    props: {
      allPostsData: [],
    },
  }
}

const headerTitle = '你好，我叫 Nicky ！'

const headerDescription = '本站内容使用 Next.js + Github Issues 自动化发布'

const Home = (): JSX.Element => (
  <Page>
    <PageHeader title={headerTitle} description={headerDescription}>
      <Button href="/about">了解更多</Button>
    </PageHeader>
    <h2>个人项目</h2>
    {projects.map(project => (
      <Project key={project.title} {...project} />
    ))}
  </Page>
)

export default Home

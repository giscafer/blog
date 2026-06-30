import Button from 'components/button'
import PageHeader from 'components/pageheader'
import Project from 'components/project'
import Page from 'components/page'

import codegenImg from 'public/projects/vscode-codegen.png'
import roothubImg from 'public/projects/roothub.png'
import leekFundImg from 'public/projects/leekfund.png'
import cleanAiImg from 'public/projects/cleanai.png'
import atelierImg from 'public/projects/atelier.png'

const projects: any[] = [
  {
    title: 'Atelier AI',
    description: '智能服饰共创平台，多 Agent 协同将设计灵感到成衣对齐压缩到小时级',
    linkText: '在线体验',
    link: 'atelier.leekhub.com',
    image: atelierImg,
  },
  {
    title: 'LeekFund',
    description: 'VSCode 里无缝融合的跟盘体验（25k+下载量）',
    linkText: '网址',
    link: 'leek.fund',
    github: 'github.com/LeekHub/leek-fund',
    image: leekFundImg,
  },
  {
    title: 'RootHub 前端物料平台',
    description: '物料资产统一管理平台，致力于前端效能提升探索',
    // link: 'roothub.leekhub.com',
    image: roothubImg,
    github: 'github.com/RootLinkFE/roothub',
  },
  {
    title: 'CodeGen',
    description: 'RootHub 前端研发平台 VSCode插件',
    linkText: '插件安装',
    link: 'marketplace.visualstudio.com/items?itemName=giscafer.roothub',
    image: codegenImg,
    github: 'github.com/RootLinkFE/vscode-roothub',
  },
  {
    title: 'AI水印去除',
    description: '100% 私密。支持 NanoBanana、豆包、千问等水印场景，全程本地秒级批量处理',
    linkText: '在线预览',
    link: 'cleanai.giscafer.com',
    image: cleanAiImg,
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
      <Button href="/about">关于我</Button>
    </PageHeader>
    <h2>个人作品</h2>
    {projects.map(project => (
      <Project key={project.title} {...project} />
    ))}
  </Page>
)

export default Home

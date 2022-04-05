import Head from 'next/head'
import Page from 'components/page'
import PageHeader from 'components/pageheader'
import Button from 'components/button'

const Custom404 = (): JSX.Element => (
  <Page>
    <Head>
      <title>404 | Giscafer.com</title>
    </Head>
    <PageHeader title="404 - 页面未找到" description="哦哦!本页面不存在，可能您点击了旧链接或拼写错误。请再试一次…">
      <Button href="/">Return home</Button>
    </PageHeader>
  </Page>
)

export default Custom404

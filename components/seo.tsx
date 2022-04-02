import { DefaultSeo } from 'next-seo'

const config = {
  title: 'Nickbing Lao - Frontend Developer & Designer',
  description: 'I’m a frontend developer & designer that loves to create stuff!',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://giscafer.com',
    site_name: 'Nickbing Lao',
    images: [
      {
        url: 'https://giscafer.com/og.png',
        alt: 'Nickbing Lao',
      },
    ],
  },
  twitter: {
    handle: '@giscafer',
    site: '@giscafer',
    cardType: 'summary_large_image',
  },
}

const SEO = (): JSX.Element => {
  return <DefaultSeo {...config} />
}

export default SEO

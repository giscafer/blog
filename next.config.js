const { withContentlayer } = require('next-contentlayer') // eslint-disable-line

module.exports = withContentlayer()({
  webpack5: true,
  images: {
    domains: [
      'user-images.githubusercontent.com',
      'files.mdnice.com',
      'cdn.nlark.com',
      'wpimg.wallstcn.com',
      'github.com',
      'giscafer.com',
      'ww1.sinaimg.cn',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require('./scripts/generate-sitemap') // eslint-disable-line
      require('./scripts/generate-rss') // eslint-disable-line
    }

    return config
  },
})

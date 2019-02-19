module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      analyzerMode: 'disabled',
      openAnalyzer: false,
    },
  },
  lintOnSave: true,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 200000,
      },
    },
  },
  productionSourceMap: false,
  // eslint-disable-next-line no-nested-ternary
  outputDir: process.env.NODE_ENV === 'production'
    ? './dist-prod/'
    : process.env.NODE_ENV === 'test'
      ? './dist-test/'
      : './dist-dev/',
};

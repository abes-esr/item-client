module.exports = {
  lintOnSave: true,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  productionSourceMap: false,
  // eslint-disable-next-line no-nested-ternary
  outputDir: process.env.VUE_OUTPUT === 'production'
    ? './dist-prod/'
    : process.env.VUE_OUTPUT === 'test'
      ? './dist-test/'
      : './dist-dev/',
};

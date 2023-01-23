module.exports = {
  lintOnSave: true,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  // eslint-disable-next-line no-nested-ternary
  outputDir: './dist/',
  transpileDependencies: true
};

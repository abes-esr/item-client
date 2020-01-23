const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"'
        }
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  // eslint-disable-next-line no-nested-ternary
  outputDir: process.env.VUE_OUTPUT === 'production'
    ? './dist-prod/'
    : process.env.VUE_OUTPUT === 'test'
      ? './dist-test/'
      : './dist-dev/',
};

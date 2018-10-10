'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"http://cirse1-dev.v3.abes.fr:8123/kopyabackoffice-0.0.1-SNAPSHOT/"'
})

const Webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
module.exports = WebpackMerge(webpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map', // source map生成方式
    devServer: { // dev环境配置
        port: 3000,
        hot: true,
        contentBase: '../dist'
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin() // 热更新
    ]
})

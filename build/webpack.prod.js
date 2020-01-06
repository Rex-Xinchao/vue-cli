const path = require('path')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
// 拷贝静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩js
const ParalleUglifyPlugin = require('webpack-parallel-uglify-plugin')
// webpack打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// HappyPack开启多进程Loader转换
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
module.exports = WebpackMerge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map', // source map生成方式
    module: {
        rules: [{
            test: /\.js$/, //js 交给happypack
            use: [{
                loader: 'happypack/loader?id=happyBabel'
            }],
            exclude: '/node_modules/'
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist')
        }]),
        new HappyPack({
            id: 'happyBabel', // 与loader对应的id
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    },
                    cacheDirectory: true
                }
            ],
            threadPool: happyThreadPool // 共享进程池
        }),
        new BundleAnalyzerPlugin({ // 分析服务的页面展示
            analyzerHost: '127.0.0.1',
            analyzerPort: 8088
        })
    ],
    optimization: {
        minimizer: [
            new ParalleUglifyPlugin({
                cacheDir: '.cache/',
                uglifyJS: {
                    output: {
                        // 删除所有的注释
                        comments: false,
                        // 最紧凑的输出
                        beautify: false
                    },
                    compress: {
                        // 删除所有的 `console` 语句，可以兼容ie浏览器
                        drop_console: true,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all', // 即使在异步和非异步块之间也可以共享块
            cacheGroups: {
                libs: {
                    name: "chunk-libs",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                }
            }
        }
    }
})

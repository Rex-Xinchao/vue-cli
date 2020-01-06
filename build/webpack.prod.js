const path = require('path')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ParalleUglifyPlugin = require('webpack-parallel-uglify-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
module.exports = WebpackMerge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    module: {
        rules: [{
            test: /\.js$/,
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
            id: 'happyBabel',
            loaders: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    },
                    cacheDirectory: true
                }
            ],
            threadPool: happyThreadPool
        }),
        new BundleAnalyzerPlugin({
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
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all',
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

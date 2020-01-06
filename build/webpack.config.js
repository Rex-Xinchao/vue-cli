const path = require('path');
// html模板配置
const HtmlWebpackPlugin = require('html-webpack-plugin');
// vue文件解析
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// css编译
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 历史打包文件清空
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 是否dev环境
const devMode = process.argv.indexOf('--mode=production') === -1;
module.exports = {
    entry: { // 入口文件
        main: path.resolve(__dirname, '../src/index.js')
    },
    output: { // 输出文件
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, '../dist'),
        chunkFilename: 'js/[name].[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
                exclude: '/node_modules/'
            },
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        compilerOptions: {
                            preserveWhitespace: false
                        }
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../dist/css/",
                        hmr: devMode
                    }
                }, 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../dist/css/",
                        hmr: devMode
                    }
                }, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, // 小于指定大小返回base64
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html'
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        }),
        new CleanWebpackPlugin()
    ],
    resolve: {
        alias: { // 快捷路径设置
            'vue$': 'vue/dist/vue.runtime.esm.js',
            '@': path.resolve(__dirname, '../src'),
            '@component': path.resolve(__dirname, '../src/component'),
            '@static': path.resolve(__dirname, '../src/static'),
            '@view': path.resolve(__dirname, '../src/view'),
            '@images': path.resolve(__dirname, '../src/static/images'),
            '@styles': path.resolve(__dirname, '../src/static/styles'),
        },
        extensions: ['*', '.js', '.json', '.vue']
    }
}
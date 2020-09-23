const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isDev = true

module.exports = {
    entry: path.resolve(__dirname, 'src/APP.js'),
    resolve:{ 
        extensions: [".js",".css",".scss",".json"], 
        //配置别名可以加快webpack查找模块的速度
        alias: {
            dom:path.resolve(__dirname, 'Dom')
        } 
    }, 
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            title: 'ZDOM',
            filename:'index.html', 
            chunks:['index'], 
            hash:true,
            //防止缓存 
            minify:{ 
                removeAttributeQuotes:true//压缩 去掉引号 
            } 
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new CleanWebpackPlugin(),

    ],
    devtool: isDev? 'source-map' : 'cheap-module-source-map',
    optimization: {
        minimizer: [
            new UglifyWebpackPlugin({
                parallel: 4
            }),
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.scss?$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },

            {
                test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'images'
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["babel-plugin-zdom-jsx"]
                            ]
                        }
                    }
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            }
        ],
        
    },
    watch: true, // 开启监听文件更改，自动刷新 
    watchOptions: { 
        ignored: /node_modules/, //忽略不用监听变更的目录 
        aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包 
        poll:1000 //每秒询问的文件变更的次数 
    }, 
    devServer: {
        contentBase: './dist',
        port: '1080',
        host: 'localhost'
    }
}


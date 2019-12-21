const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');//html动态引用打包后的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//webpack 清理目录插件

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        publicPath: '/'
    },
    module: {
        // noParse: function (content) { return /jquery|lodash/.test(content); },
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                include: [path.resolve(__dirname, 'src/')],
                use: [{
                    loader: 'url-loader', // 根据图片大小，把图片转换成 base64
                    options: {
                        limit: 10000,
                        fallback: 'file-loader',
                        name: 'assets/[name].[hash].[ext]',
                    },
                }, {
                    loader: "image-webpack-loader",
                    options: {
                        mozjpeg: { progressive: true, quality: 65 },
                        optipng: { enabled: false },
                        pngquant: { quality: [0.65, 0.90], speed: 4 },
                        gifsicle: { interlaced: false },
                        webp: { quality: 75 }
                    }
                }]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                include: [path.resolve(__dirname, 'src/')],
                use: ['file-loader']
            }, {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env']
                    }
                }],
                exclude: /(node_modules|bower_components)/,
            }]
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src/')
        },
        extensions: [".js", ".json"] //省略后缀名称
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        // 清楚之前打包的文件
        new CleanWebpackPlugin(),
        // 动态引用打包后的文件，它可以把打包后的 CSS 或者 JS 文件直接引用注入到 HTML 模版中，就不用每次手动修改。
        new HtmlWebpackPlugin({
            title: "webpack study!",
            filename: "index.html",
            template: path.resolve(__dirname, 'index.html'),
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: true,
            }
        }),


    ],
}
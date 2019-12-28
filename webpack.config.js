const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');//html动态引用打包后的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//webpack 清理目录插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //打包成单独的 CSS 文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //压缩 CSS
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //压缩 js

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name]:[chunkhash:8].js', // 公共模块命名规则 
        publicPath: '/'
    },
    devServer: {
        contentBase: './dist', // 开发服务器配置
        hot: true // 热加载
    },
    devtool: 'inline-source-map',
    module: {
        // noParse: function (content) { return /jquery|lodash/.test(content); },
        rules: [{
            test: /\.(sc|c|sa)ss$/,
            use: [
                { loader: MiniCssExtractPlugin.loader, }, {
                    loader: "css-loader",
                    options: { sourceMap: true }
                }, {
                    loader: "postcss-loader",
                    options: {
                        ident: "postcss",
                        sourceMap: true,
                        plugins: loader => [
                            require('autoprefixer')(),
                            // 这里可以使用更多配置，如上面提到的 postcss-cssnext 等
                            // require('postcss-cssnext')()
                        ]
                    }
                }, {//处理 scss或sass
                    loader: "sass-loader",
                    options: { sourceMap: true }
                }
            ]
        }, {
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
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 10, // 优先级
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all'
                }
            }
        }
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
        // 单独提取css为单独文件
        new MiniCssExtractPlugin({
            filename: 'style/[name].[hash].css', // 最终输出的文件名
            chunkFilename: 'style/[id].[hash].css'
        }),
        // 压缩css
        new OptimizeCssAssetsPlugin({}),
        // 压缩js
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        }),
        new webpack.NamedModulesPlugin(), // 热加载使用
        new webpack.HotModuleReplacementPlugin() // 热加载使用
    ],
}
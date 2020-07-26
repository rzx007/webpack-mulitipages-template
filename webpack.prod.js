const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //打包成单独的 CSS 文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //压缩 CSS
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //压缩 js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin //展示出打包后的各个bundle所依赖的模块
const merge = require('webpack-merge'); // 合并
const common = require('./webpack.common.js');

let prodConfig = {
    mode: 'production',
    module: {
        rules: [{
            test: /\.(sc|c|sa)ss$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: "css-loader",
                    options: {
                        url: false,
                        sourceMap: true,
                        modules: true,
                    }
                }, {
                    loader: "postcss-loader",
                    options: {
                        ident: "postcss",
                        sourceMap: true,
                        plugins: [require("autoprefixer")]
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }
            ]
        }]
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'initial',
    //         automaticNameDelimiter: '.',
    //         cacheGroups: {
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 priority: 1
    //             }
    //         }
    //     },
    //     runtimeChunk: {
    //         name: entrypoint => `manifest.${entrypoint.name}`
    //     }
    // },
    plugins: [
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
        new BundleAnalyzerPlugin(),
    ],
}
module.exports = merge(common, prodConfig)
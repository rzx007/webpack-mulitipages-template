const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

let devConfig = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        open: false
    },
    module: {
        rules: [{
            test: /\.(sc|c|sa)ss$/,
            use: [
                'style-loader', {
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
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
                }, { //处理 scss或sass
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }
            ]
        }]
    },
    plugins: [
        new webpack.NamedModulesPlugin(), // 更容易查看（patch）的以来
        new webpack.HotModuleReplacementPlugin() // 替换插件
    ]
}
module.exports = merge(common, devConfig)
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html动态引用打包后的文件
const fs = require('fs');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); //webpack 清理目录插件
const glob = require('glob');

class createEntry {

    constructor(files) {
        this.files = files
        this.path = ''
    }

    getEntry() {
        fs.appendFileSync(this.path, '', 'utf-8', (err) => {
            if (err) {
                return console.log('该文件不存在，重新创建失败！')
            }
            console.log("文件不存在，已新创建");
        })
    }
    //配置pages多页面获取当前文件夹下的html和js
    mulitEntry() {
        let entries = {},
            basename, tmp, pathname;
        glob.sync(this.files).forEach(function (entry) {
            basename = path.basename(entry, path.extname(entry));
            tmp = entry.split('/').splice(-3);
            pathname = basename; // 正确输出js和html的路径
            let tmpUrl = `./${tmp[0]}/${tmp[1]}/${tmp[2].split('.')[0]}.js`
            fs.appendFileSync(tmpUrl, '', 'utf-8', (err) => {
                if (err) {
                    return console.log('该文件不存在，重新创建失败！')
                }
                console.log("文件不存在，已新创建");
            })
            // 创建入口文件
            entries[pathname] = tmpUrl;
        });
        return entries;
    }
    // 创建html模板
    mutilTemplate() {
        let entries = {},
            dirname, basename, pathname, extname;
        glob.sync(this.files).forEach(function (entry) {
            dirname = path.dirname(entry);
            extname = path.extname(entry);
            basename = path.basename(entry, extname);
            pathname = path.join(dirname, basename);
            entries[basename] = basename;
        })
        return entries;
    }

}

let Entries = new createEntry('./src/pages/*.html');
let entries = Entries.mulitEntry()
console.log("------------------------------------");
console.log(entries);
let commonConfig = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash:7].js',
        publicPath: '/'
    },
    module: {
        // noParse: function (content) { return /jquery|lodash/.test(content); },
        rules: [{
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
                    mozjpeg: {
                        progressive: true,
                        quality: 65
                    },
                    optipng: {
                        enabled: false
                    },
                    pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                    },
                    gifsicle: {
                        interlaced: false
                    },
                    webp: {
                        quality: 75
                    }
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
        extensions: [".js", ".json", ".css"] //省略后缀名称
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        // 清楚之前打包的文件
        new CleanWebpackPlugin(),
        // 动态引用打包后的文件，它可以把打包后的 CSS 或者 JS 文件直接引用注入到 HTML 模版中，就不用每次手动修改。

    ],
}
let pages = Entries.mutilTemplate()

//生成HTML模板
for (const key in pages) {
    // console.log(key)
    // console.log(pages[key])
    const pathname = pages[key]
    let conf = {
        filename: pathname + '.html', //生成的html存放路径，相对于path
        template: path.resolve(__dirname, './src/pages/' + pathname + '.html'), //html模板路径
        inject: true, //允许插件修改哪些内容，包括head与body
        hash: false, //是否添加hash值
        title: pathname,
        minify: { //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    };
    conf.chunks = ['mainifest', 'vendor', pathname]

    commonConfig.plugins.push(new HtmlWebpackPlugin(conf));
}
module.exports = commonConfig;
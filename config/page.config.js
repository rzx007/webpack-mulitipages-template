const glob = require('glob')

// 统一配置多页
function muliti() {
    const pages = {}
    glob.sync('./src/page/**.html').forEach(path => {
        console.log(path);
        
        const chunk = path.split('./src/page/')[1].split('/main.js')[0];//设置名称
        pages[chunk] = {
            entry: path,
            // template: 'public/'+chunk+'.html',
            template: path.split('/main.js')[0]+'/'+chunk+'.html',
            title: chunk,
            filename:chunk+'.html',
        }
    })
    console.log(pages);
    
    return pages
}
module.exports = {
    pages: muliti(),
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
}
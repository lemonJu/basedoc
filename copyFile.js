var fs = require('fs'),
    stat = fs.stat;

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copy = function(src, dst) {
    // 读取目录中的所有文件/目录
    var paths = fs.readdirSync(src);
    paths.forEach(function(path) {
        var _src = src + '/' + path,
            _dst = dst + '/' + path,
            readable, writable;

        var st = fs.statSync(_src);

        // 判断是否为文件
        if (st.isFile()) {
            // 创建读取流
            readable = fs.createReadStream(_src);
            // 创建写入流
            writable = fs.createWriteStream(_dst);
            // 通过管道来传输流
            readable.pipe(writable);
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
            exists(_src, _dst, copy);
        }

    });

};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function(src, dst, callback) {
    // 已存在
    if (fs.existsSync(dst)) {
        copy(src, dst);
    }
    // 不存在
    else {
        fs.mkdirSync(dst);
        copy(src, dst);
    }
};
// 复制目录

exports.exists = exists;
//exists( './src', './build', copy );

// 代码生成时间: 2025-09-21 16:19:21
import { Meteor } from 'meteor/meteor';
import { FSCollection } from 'meteor/ostrio:files';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { Fiber } from 'fibers';

// 创建一个文件存储集合
const files = new FSCollection(
  'files',
  {/* 配置 */}
);

// 错误处理
const handleError = (error) => {
  console.error('Error:', error);
  throw error;
};

// 压缩文件解压工具
const decompressionTool = {
  // 解压文件
  unzipFile(sourcePath, destPath) {
    try {
      // 创建读取流
      const readStream = fs.createReadStream(sourcePath);
      // 创建解压后文件的写入路径
      const writePath = path.join(destPath, path.basename(sourcePath, '.zip'));
      // 创建解压目录
      fs.mkdirSync(writePath, { recursive: true });
      // 创建写入流
      const writeStream = fs.createWriteStream(path.join(writePath, 'extracted'));
      // 使用 archiver 解压
      const unzipper = archiver('zip', { zlib: { level: 9 } });
      readStream.pipe(unzipper).pipe(writeStream);
      
      // 监听解压事件
      unzipper.on('error', handleError);
      unzipper.on('finish', () => {
        console.log('Unzipped successfully');
      });
    } catch (error) {
      handleError(error);
    }
  },
  
  // 压缩文件
  zipFile(sourcePath, destPath) {
    try {
      // 创建压缩文件的写入路径
      const writePath = path.join(destPath, path.basename(sourcePath, path.extname(sourcePath)) + '.zip');
      // 创建压缩流
      const archive = archiver('zip', { zlib: { level: 9 } });
      // 创建写入流
      const writeStream = fs.createWriteStream(writePath);
      
      // 监听压缩事件
      archive.on('error', handleError);
      archive.pipe(writeStream);
      
      // 添加文件到压缩流
      archive.file(sourcePath, { name: path.basename(sourcePath) });
      
      // 监听 finish 事件
      writeStream.on('close', () => {
        console.log('Zipped successfully');
      });
      
      // 完成压缩
      archive.finalize();
    } catch (error) {
      handleError(error);
    }
  }
};

// 暴露工具对象到全局
Meteor.startup(() => {
  global.DecompressionTool = decompressionTool;
});

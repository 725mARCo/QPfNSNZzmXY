// 代码生成时间: 2025-09-18 04:02:02
// password_encryption_decryption.js

// 引入Meteor框架核心模块
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { EJSON } from 'meteor/ejson';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

// 密码加密解密工具类
class PasswordEncryptionDecryption {

  // 生成随机盐
  static generateSalt() {
    return Random.secret();
  }

  // 使用盐加密密码
  static encryptPassword(password, salt) {
    check(password, String);
    check(salt, String);

    // 使用Meteor内置的密码加密函数
    return Accounts._hashPassword(password, salt);
  }

  // 解密密码（验证密码）
  static decryptPassword(password, hashedPassword) {
    check(password, String);
    check(hashedPassword, String);

    // 使用Meteor内置的密码验证函数
    return Accounts._checkPassword(password, hashedPassword);
  }
}

// 导出类
export { PasswordEncryptionDecryption };

// 使用示例
if (Meteor.isClient) {
  Meteor.startup(() => {

    // 客户端代码，用于演示密码加密解密
    console.log('Password Encryption/Decryption Tool');

    // 生成盐
    const salt = PasswordEncryptionDecryption.generateSalt();
    console.log('Salt:', salt);

    // 加密密码
    const password = 'mySuperSecretPassword123';
    const hashedPassword = PasswordEncryptionDecryption.encryptPassword(password, salt);
    console.log('Hashed Password:', hashedPassword);

    // 解密密码（验证）
    const isMatch = PasswordEncryptionDecryption.decryptPassword(password, hashedPassword);
    console.log('Password match:', isMatch);

  });
}

// 代码生成时间: 2025-10-08 02:12:28
// Import necessary Meteor packages and modules
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { FilesCollection } from 'meteor/ostrio:files';
import CryptoJS from 'crypto-js';

// Define the encryption settings
const encryptionKey = 'your-encryption-key'; // Replace with a secure encryption key

// Create a file collection
const Files = new FilesCollection({
  debug: true,
  collectionName: 'files',
  allowClientCode: false,
  storeToFileSystem: true,
  onAfterUpload: function(fileRef) {
    // Encrypt the file
    Meteor.call('encryptFile', fileRef._id);
  },
  onBeforeUpload: function(file) {
    // Allow certain file types and sizes
    if(file.size <= 20971520) { // Max 20MB
      return true;
    } else {
      return 'File too large';
    }
  }
});

// Define Meteor methods
Meteor.methods({
  'encryptFile': function(fileId) {
    check(fileId, String);
    try {
      const fileRecord = Files.collection.findOne(fileId);
      if (!fileRecord) {
        throw new Meteor.Error('file-not-found', 'File not found');
      }
      const file = FS.File.findOne(fileId);
      const encryptedFilename = fileRecord.name + '.enc';
      const encryptedFile = CryptoJS.AES.encrypt(file.content, encryptionKey).toString();
      // Save the encrypted file
      FS.File.writeFile(encryptedFilename, encryptedFile);
      return encryptedFilename;
    } catch (error) {
      throw new Meteor.Error('encryption-error', 'Error encrypting file', error);
    }
  },
  'decryptFile': function(encryptedFileId) {
    check(encryptedFileId, String);
    try {
      const encryptedFile = FS.File.findOne(encryptedFileId);
      if (!encryptedFile) {
        throw new Meteor.Error('file-not-found', 'File not found');
      }
      const decryptedContent = CryptoJS.AES.decrypt(encryptedFile.content, encryptionKey);
      const decryptedFilename = encryptedFile.name.replace('.enc', '');
      // Save the decrypted file
      FS.File.writeFile(decryptedFilename, decryptedContent.toString(CryptoJS.enc.Utf8));
      return decryptedFilename;
    } catch (error) {
      throw new Meteor.Error('decryption-error', 'Error decrypting file', error);
    }
  }
});

// Add a route to handle file uploads
WebApp.connectHandlers.use('/files', function(req, res, next) {
  // Handle file upload
  Files._handleUpload(req, res);
  next();
});

// Error handling middleware
WebApp.connectHandlers.use(function(err, req, res, next) {
  res.writeHead(err.status || 500, {'Content-Type': 'text/plain'});
  res.end(err.message || 'Unknown error');
});

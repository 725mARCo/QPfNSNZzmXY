// 代码生成时间: 2025-09-21 21:34:47
 * moving files into a predefined directory structure.
 */

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { check } from 'meteor/check';
import { FilesCollection } from 'meteor/cfs:files';

// Define the FilesCollection, if not already defined
const filesCollection = new FilesCollection({
  debug: true,
  collectionName: 'files', // Name of the collection
  permission: function() {
    return true;
  }
});

// Checks if the file exists in the specified path
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}

// Moves a file from one directory to another
function moveFile(sourcePath, destinationPath) {
  try {
    if (!fileExists(sourcePath)) {
      throw new Error('Source file does not exist.');
    }
    fs.renameSync(sourcePath, destinationPath);
    console.log('File moved successfully:', sourcePath, '->', destinationPath);
  } catch (error) {
    console.error('Error moving file:', error.message);
  }
}

// Organizes the file structure according to predefined rules
function organizeFolderStructure(sourceFolderPath, rules) {
  try {
    if (!fileExists(sourceFolderPath)) {
      throw new Error('Source folder does not exist.');
    }

    // Iterate through each rule
    rules.forEach((rule) => {
      const { pattern, destination } = rule;
      const files = fs.readdirSync(sourceFolderPath)
        .filter(file => file.match(pattern))
        .map(file => `${sourceFolderPath}/${file}`);

      files.forEach((file) => {
        const destinationPath = `${destination}/${file.split('/').pop()}`;
        moveFile(file, destinationPath);
      });
    });
  } catch (error) {
    console.error('Error organizing folder structure:', error.message);
  }
}

// Start the Meteor method
Meteor.startup(() => {
  // Define Meteor method to organize folder structure
  Meteor.methods({
    'organizeFolderStructure': function(sourceFolderPath, rules) {
      check(sourceFolderPath, String);
      check(rules, [Object]);

      // Call the function to organize folder structure
      organizeFolderStructure(sourceFolderPath, rules);
    }
  });
});
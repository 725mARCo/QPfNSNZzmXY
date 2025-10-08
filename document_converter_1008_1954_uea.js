// 代码生成时间: 2025-10-08 19:54:05
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Define a new Meteor method to handle document conversion
Meteor.methods({
  'convertDocument': function(fileInput, targetFormat) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to convert documents.');
    }

    // Validate input parameters
    if (!fileInput || !targetFormat) {
      throw new Meteor.Error('invalid-parameters', 'Invalid file input or target format parameters.');
    }

    // Add your document conversion logic here
    // For demonstration, we'll just simulate a conversion by changing the file extension
    let convertedFile = fileInput + '.' + targetFormat;

    // Return the converted file path
    return convertedFile;
  }
});

// Create a template for the document conversion form
Template.documentConverter.onCreated(function() {
  // ReactiveVar to hold the conversion status
  this.conversionStatus = new ReactiveVar('');
});

// Helper function to call the convertDocument method and update the conversion status
Template.documentConverter.helpers({
  'convert': function() {
    let fileInput = Template.instance().find('input[name="fileInput"]').value;
    let targetFormat = Template.instance().find('select[name="targetFormat"]').value;

    // Call the Meteor method and handle the result
    Meteor.call('convertDocument', fileInput, targetFormat, function(error, result) {
      if (error) {
        // Update the conversion status with the error message
        Template.instance().conversionStatus.set('Error: ' + error.reason);
      } else {
        // Update the conversion status with the converted file path
        Template.instance().conversionStatus.set('Converted file: ' + result);
      }
    });
  }
});

// Template for the document converter form
Template.documentConverter.helpers({
  'conversionStatus': function() {
    return Template.instance().conversionStatus.get();
  }
});

// Template for the document converter form
Template.documentConverter.events({
  // Submit event handler for the form
  'submit form': function(event, templateInstance) {
    event.preventDefault();
    // Call the helper function to perform the conversion
    templateInstance.$('.conversion-status').text('Conversion in progress...');
    Template.instance().convert();
    return false;
  }
});
// 代码生成时间: 2025-10-05 03:19:26
// Meteor A/B Testing Framework

// This Meteor application demonstrates a simple A/B testing framework.
// It allows for easy setup of A/B tests with different groups and outcomes.

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store A/B test results
const AbTestResults = new Mongo.Collection('abTestResults');

// Define a schema for A/B test results using SimpleSchema
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import { AutoFormSchemas } from 'meteor/aldeed:autoform-schema';

const AbTestResultSchema = new SimpleSchema({
  groupId: {
    type: String,
    label: 'Group ID'
  },
  outcome: {
    type: String,
    label: 'Outcome'
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      return new Date();
    },
    denyInsert: true,
    optional: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function () {
      return this.userId;
    },
    denyUpdate: true,
    optional: true,
  },
});

AbTestResults.attachSchema(AbTestResultSchema);

// Function to get a random group ID
function getRandomGroup() {
  // For simplicity, we'll use two groups: 'A' and 'B'
  const groups = ['A', 'B'];
  return groups[Math.floor(Math.random() * groups.length)];
}

// Function to log the outcome of an A/B test
Meteor.methods({
  'abTest.logOutcome': function (outcome) {
    // Simple check to ensure the outcome is valid
    check(outcome, String);

    // Get the current user's ID
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to participate in A/B testing.');
    }

    // Get the group ID for the current user
    const groupId = getRandomGroup();

    // Log the outcome to the AbTestResults collection
    AbTestResults.insert({
      groupId: groupId,
      outcome: outcome,
      userId: userId,
    });
  },
});

// Function to get the results of the A/B test
Meteor.methods({
  'abTest.getResults': function () {
    // Check if the user is logged in and has the necessary permissions
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to view A/B test results.');
    }

    // Return the results from the AbTestResults collection
    return AbTestResults.find().fetch();
  },
});

// Publish the A/B test results to all clients
Meteor.publish('abTestResults', function () {
  return AbTestResults.find();
});

// Example usage of the A/B testing framework
// This could be part of a larger application where a user makes a decision
// and the outcome is logged using the 'abTest.logOutcome' method.

// Example:
// if (Meteor.userId()) {
//   Meteor.call('abTest.logOutcome', 'User chose option A');
// }

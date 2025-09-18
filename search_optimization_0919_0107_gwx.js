// 代码生成时间: 2025-09-19 01:07:02
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store search terms and results
const SearchTerms = new Mongo.Collection('searchTerms');

// Define a function to insert a search term
function insertSearchTerm(terms) {
    // Check if the input is an array
    if (!Array.isArray(terms)) {
        throw new Meteor.Error('InvalidInput', 'Search terms must be an array');
    }
    
    // Insert each term into the database
    terms.forEach(term => {
        SearchTerms.insert({ term: term.trim() });
    });
}

// Define a function to search for terms
function searchForTerms(query) {
    // Check if the input is a string
    if (!check(query, String)) {
        throw new Meteor.Error('InvalidInput', 'Query must be a string');
    }
    
    // Perform a case-insensitive search for the query in the database
    const results = SearchTerms.find({ term: { $regex: query, $options: 'i' } }).fetch();
    return results;
}

// Define a Meteor method to handle client-side calls
Meteor.methods({
    'searchTerms.insert': function(terms) {
        // Check if the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error('NotLoggedIn', 'You must be logged in to perform this action');
        }
        
        // Call the insert function
        insertSearchTerm(terms);
    },
    'searchTerms.search': function(query) {
        // Check if the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error('NotLoggedIn', 'You must be logged in to perform this action');
        }
        
        // Call the search function
        return searchForTerms(query);
    }
});

// Define a publication to publish search terms to the client
Meteor.publish('searchTerms', function() {
    return SearchTerms.find();
});